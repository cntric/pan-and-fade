import React, { FC, useEffect, useReducer, useRef, useState } from 'react';

/**
 * @description
 */
export type PanAndFadeProps = {
    vertical? : boolean,
    horizontal? : boolean,
    style? : React.CSSProperties
}

const getClientScrollPos = (el : HTMLElement)=>{
    const x = el.scrollLeft;
    const y = el.scrollTop;
    return {
        x, y
    }
}

const HotScroller : FC<{
    el : HTMLElement,
    timing? : number
    horizontalSpeed? : number,
    verticalSpeed? : number,
    forceUpdate? : ()=>void
}> = ({children, el, timing=50, horizontalSpeed=10, verticalSpeed=0, forceUpdate})=>{

    const [updater, setUpdater] = useState<ReturnType<typeof setInterval>|undefined>()

    const {x , y} =  el ? getClientScrollPos(el) : {x : 0, y : 0};

    const makeRepeatingUpdate = ()=>{
        return setInterval(()=>{
            if(el){
                el.scroll({
                    top : el.scrollTop + verticalSpeed,
                    left : el.scrollLeft + horizontalSpeed,
                    behavior : "smooth"
                });
            }
    }, timing)}

    return (
        <div 
            onMouseEnter={()=>{
                
                if(updater){
                    clearInterval(updater);
                }
                setUpdater(makeRepeatingUpdate());
            }}
            onMouseLeave={()=>{
                if(updater){
                    clearInterval(updater);
                    if(forceUpdate){
                        forceUpdate();
                    }
                }
            }}
            style={{
                height: "100%",
                width : "100%", 
                right : 0,
                zIndex: 1000
            }}
        >
            {children}
        </div>
    )

}

const Fader : FC<{
    rotation? : React.CSSProperties["rotate"]
}> = ({rotation = "0deg"})=>{

        return (
            <div style={{
                height: "100%",
                width: "100%",
                background: `linear-gradient(${rotation}, #00000000, #2D2D2D05, #2D2D2D10)`
            }}>

            </div>
        )
}

const HotScrollingCorners : FC<{el: HTMLElement, horizontalSpeed? : number, verticalSpeed? : number}> = ({
    el,
    horizontalSpeed=100,
    verticalSpeed=0,
})=>{

    const [tick, forceUpdate] = useReducer(x=>x+1, 0)

    const {x , y} =  el ? getClientScrollPos(el) : {x : 0, y : 0};

    return (
        <div 
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                zIndex: 1000,
                pointerEvents: "none"
            }}>
                {horizontalSpeed > 0 && (el ? x > 1 : true) && <div style={{
                    position: "absolute",
                    height: "100%",
                    width: "20px",
                    left : 0,
                    pointerEvents: "auto"
                }}>
                    <HotScroller 
                        forceUpdate={forceUpdate}
                        verticalSpeed={0}
                        horizontalSpeed={-horizontalSpeed}
                        {...{el}}>
                            <Fader rotation="-90deg"/>
                    </HotScroller>
                </div>}
                {horizontalSpeed > 0 && (el ? ((x + el.offsetWidth) < el.scrollWidth) : true) && <div style={{
                    position: "absolute",
                    height: "100%",
                    width: "20px",
                    right : 0,
                    pointerEvents: "auto"
                }}>
                    <HotScroller 
                        forceUpdate={forceUpdate}
                        verticalSpeed={0}
                        horizontalSpeed={horizontalSpeed}
                        {...{el}}>
                            <Fader rotation="90deg"/>
                    </HotScroller>
                </div>}
                {verticalSpeed > 0 && (el ? y < el.clientHeight : true) && <div style={{
                    position: "absolute",
                    height: "20px",
                    width: "100%",
                    right : 0,
                    pointerEvents: "auto"
                }}>
                    <HotScroller 
                        forceUpdate={forceUpdate}
                        verticalSpeed={-verticalSpeed}
                        horizontalSpeed={0}
                        {...{el}}>
                             <Fader rotation="0deg"/>
                    </HotScroller>
                </div>}
                {verticalSpeed > 0 && (el ? y > 1: true) && <div style={{
                    position: "absolute",
                    height: "20px",
                    width: "100%",
                    right : 0,
                    pointerEvents: "auto"
                }}>
                    <HotScroller 
                        forceUpdate={forceUpdate}
                        verticalSpeed={verticalSpeed}
                        horizontalSpeed={0}
                        {...{el}}>
                             <Fader rotation="180deg"/>
                    </HotScroller>
                </div>}
        </div>
    )
}

/**
 * Component fades the around the edges an pans on hover.
 * @param param0 
 * @returns 
 */
export const PanAndFade : FC<PanAndFadeProps>  = ({vertical=false, horizontal=true, children, style}) =>{

    const ref = useRef<HTMLDivElement>(null);
    const [el, setEl] = useState<HTMLDivElement|null>(ref.current);

    useEffect(()=>{
        if(el !== ref.current){
            setEl(ref.current);
        }
    })

    return (

        <div 
        style={{
            height: "100%",
            width: "100%",
            position: "relative",
            ...style
        }}>
            <HotScrollingCorners  el={ref.current as HTMLDivElement}/>
            <div ref={ref} 
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    position: "relative",
                    overflowX: "scroll",
                    overflowY: "scroll",
                }}>
                {children}
            </div>
        </div>

    )

}