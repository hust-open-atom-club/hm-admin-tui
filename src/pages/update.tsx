import React from "react";
import { LogElement, RadioButtonElement } from "react-blessed";
import { cicdUpdate } from "../services/docker";

export default function() {

  const logRef = React.useRef<LogElement>(null);

  const style = {
    focus: {
      bg: 'white',
      fg: 'black'
    }
  }

  React.useEffect(() => {
    const func = (ch: string) => {
      // @ts-ignore
      if (radioRefs.current[ch]) {
        // @ts-ignore
        (radioRefs.current[ch] as RadioButtonElement).check();
        screen.render();
      }
    };
    screen.on('keypress', func);
    screen.key('enter', submit);
    return () => {
      screen.removeListener('keypress', func);
      screen.unkey('enter', submit);
    }
  }, []);

  const radioRefs = React.useRef<{ [key: string]: RadioButtonElement }[]>([]);
  const setRadioRef = (s: string) => {
    return (e: RadioButtonElement) => {
      if (radioRefs.current)
        //@ts-ignore
        radioRefs.current[s] = e;
    }
  }

  const buttonProps = {
    keyable: true,
    mouse: true,
    width: 15,
    height: 1,
    style
  }

  const logger = (log: string) => {
    logRef.current?.log(log);
  };

  let lastEnter = React.useRef<number>(0);

  const submit = () => {
    const last = lastEnter.current;
    lastEnter.current = new Date().getTime();

    if (new Date().getTime() - last > 3000) {
      logger("Press enter again to confirm.");
      return;
    }
    else {
      lastEnter.current = 0;
    }

    const selected = Object.keys(radioRefs.current).filter(k => {
      // @ts-ignore
      return radioRefs.current[k].checked;
    });
    let content = ""
    let branch = "";
    if (selected.indexOf('a') != -1) content = "all";
    else if (selected.indexOf('b') != -1) content = "page";
    else if (selected.indexOf('c') != -1) content = "cli";
    else if (selected.indexOf('d') != -1) content = "release";

    if (selected.indexOf('m') != -1) branch = "master";
    else if (selected.indexOf('s') != -1) branch = "stable";

    if (content && branch) {
      cicdUpdate(content, branch, logger).catch((e) => {
        logger("Update failed.");
      });
    }
    else {
      logger("Please select content and branch.");
    }
  };

  return <>
    <box border='line' height='50%' >
      <box content="What do you want to update?"></box>
      <box top={1}>
        <radiobutton ref={setRadioRef('a')} left="0" content="A: All" {...buttonProps}></radiobutton>
        <radiobutton ref={setRadioRef('b')} left="25%" content="B: Page" {...buttonProps}></radiobutton>
        <radiobutton ref={setRadioRef('c')} left="50%" content="C: Cli Tool" {...buttonProps}></radiobutton>
        <radiobutton ref={setRadioRef('d')} left="75%" content="D: Releases" {...buttonProps}></radiobutton>
      </box>
      <box top={3} content="What branch do you like to update?"></box>

      <box top={4}>
        <radiobutton ref={setRadioRef('m')} left="0" content="M: master" {...buttonProps}></radiobutton>
        <radiobutton ref={setRadioRef('s')} left="50%" content="S: stable" {...buttonProps}></radiobutton>
      </box>

      <box bottom={1} height={1} content="Input characters before colon to select."></box>
      <box bottom={0} height={1} content="Double enter to confirm, all operations will be logged!"></box>
    </box>


    <log top='50%' height='50%' border='line' ref={logRef}></log>

  </>
}
