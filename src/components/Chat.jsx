import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ArrowRightIcon from './icons/ArrowRightIcon';
import StopIcon from './icons/StopIcon';
import Progress from './Progress';

const IS_WEBGPU_AVAILABLE = !!navigator.gpu;
const STICKY_SCROLL_THRESHOLD = 120;

function Chat() {
  const worker = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Model loading and progress
  const [status, setStatus] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progressItems, setProgressItems] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Inputs and outputs
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [tps, setTps] = useState(null);
  const [numTokens, setNumTokens] = useState(null);

  function onEnter(message) {
    setMessages(prev => [
      ...prev,
      { "role": "user", "content": message },
    ]);
    setIsRunning(true);
    setInput('');
  }

  useEffect(() => {
    resizeInput();
  }, [input]);

  function onInterrupt() {
    worker.current.postMessage({ type: 'interrupt' });
  }

  function resizeInput() {
    if (!textareaRef.current) return;

    const target = textareaRef.current;
    target.style.height = 'auto';
    const newHeight = Math.min(Math.max(target.scrollHeight, 24), 100); // Ajuste el tamaño máximo a 100px
    target.style.height = `${newHeight}px`;
  }

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    }

    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'loading':
          setStatus('loading');
          setLoadingMessage(e.data.data);
          break;
        case 'initiate':
          setProgressItems(prev => [...prev, e.data]);
          break;
        case 'progress':
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, ...e.data }
              }
              return item;
            })
          );
          break;
        case 'done':
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;
        case 'ready':
          setStatus('ready');
          break;
        case 'start':
          setMessages(prev => [...prev, { "role": "assistant", "content": "" }]);
          break;
        case 'update': {
          const { output, tps, numTokens } = e.data;
          setTps(tps);
          setNumTokens(numTokens)
          setMessages(prev => {
            const cloned = [...prev];
            const last = cloned.at(-1);
            cloned[cloned.length - 1] = { ...last, content: last.content + output };
            return cloned;
          });
        }
          break;
        case 'complete':
          setIsRunning(false);
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);

    return () => {
      worker.current.removeEventListener('message', onMessageReceived);
    };
  }, []);

  useEffect(() => {
    if (messages.filter(x => x.role === 'user').length === 0) {
      return;
    }
    if (messages.at(-1).role === 'assistant') {
      return;
    }
    setTps(null);
    worker.current.postMessage({ type: 'generate', data: messages });
  }, [messages, isRunning]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (isRunning) {
      const element = chatContainerRef.current;
      if (element.scrollHeight - element.scrollTop - element.clientHeight < STICKY_SCROLL_THRESHOLD) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [messages, isRunning]);

  return (
    IS_WEBGPU_AVAILABLE
      ? (<div className="flex w-full col-span-2 h-20% mx-auto items justify-end text-gray-200 bg-#2e2e2e">
        {status === null && messages.length === 0 && (
          <div className="w-full h-full overflow-auto scrollbar-thin flex justify-center items-center flex-col relative">
            <div className="flex flex-col items-center mb-1 max-w-[250px] text-center">
              <h1 className="text-4xl font-bold mb-1">Phi-3 WebGPU</h1>
              <h2 className="font-semibold">Chat IA renderizada en cliente</h2>
            </div>
            <div className="flex flex-col items-center px-4">
              
              <button
                className="border px-4 py-2 rounded-lg bg-blue-400 text-white hover:bg-blue-500 disabled:bg-blue-100 disabled:cursor-not-allowed select-none"
                onClick={() => {
                  worker.current.postMessage({ type: 'load' });
                  setStatus('loading');
                }}
                disabled={status !== null}
              >
                Load model
              </button>
            </div>
          </div>
        )}
        {status === 'loading' && (<>
          <div className="w-full max-w-[500px] text-left mx-auto p-4 bottom-0 mt-auto">
            <p className="text-center mb-1">{loadingMessage}</p>
            {progressItems.map(({ file, progress, total }, i) => (
              <Progress key={i} text={file} percentage={progress} total={total} />
            ))}
          </div>
        </>)}
        {status === 'ready' && (<div
          ref={chatContainerRef}
          className="overflow-y-auto scrollbar-thin w-full flex flex-col items-center h-full"
        >
          <motion.div
            className="chat-component p-6 rounded-lg shadow-lg flex flex-col items-center bg-gray-900 w-full h-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="chat-messages flex flex-col w-full h-full overflow-y-auto mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`message-bubble ${message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'} p-2 rounded-lg inline-block max-w-xl`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input w-full flex relative">
              <textarea
                ref={textareaRef}
                className="scrollbar-thin w-full dark:bg-gray-700 px-3 py-2 rounded-lg bg-transparent border-none outline-none text-gray-200 disabled:text-gray-400 placeholder-gray-400 disabled:placeholder-gray-200 resize-none disabled:cursor-not-allowed"
                placeholder="Type your message..."
                type="text"
                rows={1}
                value={input}
                disabled={status !== 'ready'}
                title={status === 'ready' ? "Model is ready" : "Model not loaded yet"}
                onKeyDown={(e) => {
                  if (input.length > 0 && !isRunning && (e.key === "Enter" && !e.shiftKey)) {
                    e.preventDefault();
                    onEnter(input);
                  }
                }}
                onInput={(e) => setInput(e.target.value)}
              />
              {isRunning
                ? (<div className="cursor-pointer" onClick={onInterrupt}>
                  <StopIcon
                    className="h-8 w-8 p-1 rounded-md text-gray-200 dark:text-gray-200 absolute right-3 bottom-3"
                  />
                </div>)
                : input.length > 0
                  ? (<div className="cursor-pointer" onClick={() => onEnter(input)}>
                    <ArrowRightIcon
                      className="h-8 w-8 p-1 bg-gray-800 dark:bg-gray-100 text-white dark:text-black rounded-md absolute right-3 bottom-3"
                    />
                  </div>)
                  : (<div>
                    <ArrowRightIcon
                      className="h-8 w-8 p-1 bg-gray-600 text-gray-400 rounded-md absolute right-3 bottom-3"
                    />
                  </div>)
              }
            </div>
          </motion.div>
          <p className="text-center text-sm min-h-6 text-gray-300">
            {tps && messages.length > 0 && (<>
              {!isRunning &&
                <span>Generated {numTokens} tokens in {(numTokens / tps).toFixed(2)} seconds&nbsp;&#40;</span>}
              {<>
                <span className="font-medium text-center mr-1 text-white">
                  {tps.toFixed(2)}
                </span>
                <span className="text-gray-300">tokens/second</span>
              </>}
              {!isRunning && <>
                <span className="mr-1">&#41;.</span>
                <span className="underline cursor-pointer" onClick={() => {
                  worker.current.postMessage({ type: 'reset' });
                  setMessages([]);
                }}>Reset</span>
              </>}
            </>)}
          </p>
        </div>)}
      </div>)
      : (<div className="fixed w-screen h-screen bg-black z-10 bg-opacity-[92%] text-white text-2xl font-semibold flex justify-center items-center text-center">WebGPU is not supported<br />by this browser :&#40;</div>)
  )
}

export default Chat;
