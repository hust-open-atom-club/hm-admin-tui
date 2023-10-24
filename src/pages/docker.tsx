import React, { useRef } from "react";
import globalStore from "../globalStore";
import { composePS, startAll, stopAll } from "../services/docker";
import { LogElement } from "react-blessed";

export default function() {

  const { help: [_, setHelp] } = React.useContext(globalStore)!;

  const log1 = useRef<LogElement>(null);
  const log2 = useRef<LogElement>(null);

  const getContent = async () => {
    log1.current?.setContent("");
    try {
      await composePS(s => {
        log1.current?.log(s);
      });
    }
    catch (e) { }
  }

  const logger = (s: string) => { log2.current?.log(s); }

  const onKey = (ch: string) => {
    if (ch === 's') startAll(logger).catch(() => { });
    else if (ch === 'd') stopAll(logger).catch(() => { });
  };

  React.useEffect(() => {
    setHelp("s: start.  d:stop.  ")

    // const id = setInterval(() => {
    //   getContent();
    // }, 2000);
    // getContent();

    screen.on('keypress', onKey);

    return () => {
      setHelp("");
      // clearInterval(id);
      screen.removeListener('keypress', onKey);
    };
  }, []);

  return <>
    {/* <log ref={log1} border='line' height={10}></log> */}
    <log ref={log2} border='line' height="100%"></log>
  </>

}
