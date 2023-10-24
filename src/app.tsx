// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Tunasync from './pages/tunasync';
import Update from './pages/update';
import GlobalStore from './globalStore';
import Docker from './pages/docker';

export default function() {

  const [page, setPage] = React.useState<string>("update");

  useEffect(() => {
    function listener(ch, key) {
      setPage(['update', 'docker', 'tunasync'][parseInt(ch) - 1]);
    }
    screen.key(['1', '2', '3'], listener);
    return () => {
      screen.removeKey(['1', '2', '3'], listener);
    }
  }, []);

  const helpState = useState("");

  return (
    <GlobalStore.Provider value={{
      help: helpState
    }}>
      <box border='line' mouse height={3}
        content='1: update  2:docker  3:tunasync  ' />

      <box top={3} width='100%' height='100%-4'>
        {page === 'tunasync' && <Tunasync />}
        {page === 'update' && <Update />}
        {page === 'docker' && <Docker />}
      </box>
      <HelpBar help={helpState[0]} />
    </GlobalStore.Provider>
  )
}


function HelpBar({ help }: { help?: string }) {
  const keyStr = "Number key: switch page.  " +
    "q: close.  ";
  return (
    <>
      <box bottom={0} height={1} width="100%"
        bg='white' fg='black' content={help + keyStr} />
    </>
  )
}
