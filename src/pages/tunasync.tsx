
import React, { useState } from 'react';
import { ListTableElement, LogElement } from 'react-blessed';
import globalStore from '../globalStore';
import { Mirror as OriginMirror, disableJob, flushAllJob, getMirrors, getWorkers, reloadWorker, restartJob, startJob, stopJob } from '../services/tunasync';

type Mirror = OriginMirror & { worker: string }

export default function() {

  const [mirrors, setMirrors] = React.useState<Mirror[]>([]);
  const { help: [_, setHelp] } = React.useContext(globalStore)!;

  const innerLog = React.useRef<LogElement>(null);
  const logger = React.useCallback((log: string) => {
    innerLog.current?.log(log);
  }, []);


  React.useEffect(() => {
    let cancelled = false;
    async function getItems() {
      try {
        const wl = await getWorkers(logger);
        const list = [];
        for (const w of wl) {
          const mirrors = await getMirrors(w.id, logger);
          if (!cancelled) list.push(...mirrors.map(m => ({ ...m, worker: w.id })));
        }
        list.sort((a, b) => a.name.localeCompare(b.name));
        setMirrors(list);
      }
      catch (e) {
        screen.debug("err fetch list" + e);
      }
    }

    const id = setInterval(getItems, 5000);
    getItems();

    setHelp("j/k: move up or down.  Enter: open selected.  ")

    return () => {
      setHelp("");
      clearInterval(id);
      cancelled = true;
    };
  }, []);

  const reload = () => {
  };


  return (
    <>
      <Main mirrors={mirrors} onReload={reload} logRef={innerLog} />
    </>
  )
}

type MirrorListProps = {
  mirrors: Mirror[];
  selected?: number;
  onSelect?: (index: number) => void;
}

function MirrorList(props: MirrorListProps) {
  const listRef = React.useRef<ListTableElement>(null);

  const [selected, setSelected] = useState(1);

  React.useEffect(() => {
    const localRef = listRef.current;
    listRef.current?.focus();

    const func = () => {
      // @ts-ignore 
      setSelected(listRef.current?.selected || 1);
      if (listRef.current) {
        // @ts-ignore
        props.onSelect?.(listRef.current.selected - 1);
      }
    };

    listRef.current?.on('keypress', func);

    return () => {
      localRef?.removeListener('keypress', func);
    };

  }, []);

  React.useEffect(() => {
    props.onSelect?.(selected - 1);
  }, [props.mirrors]);

  return (
    <listtable
      border='line'
      noCellBorders
      width="100%"
      height="100%"
      invertSelected={false}
      ref={listRef}
      keys vi mouse
      selected={selected}
      data={[["Name", "Status"]].concat(
        props.mirrors.map(m => [m.name, m.status || "unknown"])
      )}
      focusable
      align="left"
      style={{
        selected: {
          inverse: true,
          bold: true
        },
        // @ts-ignore
        header: {
          invise: true,
          bold: true,
          fg: 'blue',
        }
      }}
    />
  )
}

type MirrorDetailProps = {
  mirror?: Mirror;
  onSave: () => void;
}

function MirrorDetail(props: MirrorDetailProps) {

  if (!props.mirror) return (<box content='Select a mirror to continue'></box>);

  const str = `Name: ${props.mirror.name}\n` +
    `Status: ${props.mirror.status}\n` +
    `Upstream: ${props.mirror.upstream}\n` +
    `Last start: ${props.mirror.last_started}\n` +
    `Last update: ${props.mirror.last_update}\n` +
    `Last end: ${props.mirror.last_ended}\n` +
    `Size: ${props.mirror.size}\n` +
    `Master: ${props.mirror.is_master}\n` +
    `Worker: ${props.mirror.worker}`

  return (
    <box content={str}></box>
  )
}

type MainProps = {
  mirrors: Mirror[];
  onReload: () => void;
  logRef: React.RefObject<LogElement>;
}

function Main(props: MainProps) {

  const style = { bg: 'white', fg: 'black' };

  const [selectedMirror, setSelectedMirror] = React.useState<Mirror | undefined>(undefined);

  const mirrorsRef = React.useRef<Mirror[]>([]);

  mirrorsRef.current = props.mirrors;


  const logger = React.useCallback((log: string) => {
    props.logRef.current?.log(log);
  }, []);

  const func = (ch: string) => {
    if (selectedMirror) {
      if (ch === 's') startJob(selectedMirror.worker, selectedMirror?.name, logger).catch(() => { });
      if (ch === 'e') restartJob(selectedMirror.worker, selectedMirror?.name, logger).catch(() => { });
      if (ch === 't') stopJob(selectedMirror.worker, selectedMirror?.name, logger).catch(() => { });
      if (ch === 'd') disableJob(selectedMirror.worker, selectedMirror?.name, logger).catch(() => { });
      if (ch === 'r') reloadWorker(selectedMirror.worker, logger).catch(() => { });
    }
    if (ch === 'f') flushAllJob(logger).catch(() => { });
  };



  React.useEffect(() => {
    screen.on('keypress', func);
    return () => {
      screen.removeListener('keypress', func);
    }
  }, [selectedMirror]);

  return (
    <>
      <box height="70%">
        <box height="100%" width="50%">
          <MirrorList mirrors={props.mirrors} onSelect={(d) => { setSelectedMirror(mirrorsRef.current[d]) }} />
        </box>
        <box height="100%" label='Mirror' left='50%' border='line' width="50%">
          <MirrorDetail mirror={selectedMirror} onSave={() => { }} />
        </box>
      </box>

      <log ref={props.logRef} height="30%" top="70%" border='line'></log>
      <box bottom={0} height={1}>

        <box left={0} content='(s)tart' style={style}></box>
        <box left={10} content='r(e)start' style={style}></box>
        <box left={20} content='s(t)op' style={style}></box>
        <box left={30} content='(d)isable' style={style}></box>
        <box left={40} content='(r)eload' style={style}></box>
        <box left={50} content='(f)lush' style={style}></box>

      </box>
    </>
  )

}

