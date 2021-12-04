import React, { useRef, RefObject, useState } from 'react';
import logo from './logo.svg';
import { PanAndFade} from './PanAndFade';

function App() {

  const ref = useRef<HTMLDivElement>(null);
  const [isModaled, setModaled] = useState(false);

  return (
    <div className="App">
        <div 
        onClick={()=>{
          setModaled(!isModaled);
        }}
        ref={ref}
        style={{
          height : "100px",
          width : "100px",
          background : "pink"
        }}>

        </div>
        <PanAndFade style={{
          width : "80px"
        }}>
          dfhsdfkjhsdkjfhdjkshfjkdshfjkdhsfjkdhsfjhdsjkfhdjksfhdjkshfjkdhsfjkdhsfjkhdsjkfhdsfjkh
        </PanAndFade>
    </div>
  );
}

export default App;
