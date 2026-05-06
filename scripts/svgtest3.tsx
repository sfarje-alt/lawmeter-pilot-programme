import React from "react";
import { renderToFile, Document, Page, Text, View, Svg, Rect, G, Path, Circle } from "@react-pdf/renderer";

function VBarChart({ data, width=230, height=120 }: any) {
  const pad={l:22,r:8,t:6,b:22};
  const W=width-pad.l-pad.r, H=height-pad.t-pad.b;
  const max=Math.max(1,...data.map((d:any)=>d.value));
  const bw=W/data.length;
  return (<Svg width={width} height={height}>
    {data.map((d:any,i:number)=>{
      const h=(d.value/max)*H, x=pad.l+i*bw+bw*0.18, y=pad.t+H-h, w=bw*0.64;
      return <G key={i}>
        <Rect x={x} y={y} width={w} height={h} fill={d.color||"#1a365d"} rx={2}/>
        <Text x={x+w/2} y={y-2} style={{fontSize:6.5}}>{String(d.value)}</Text>
      </G>;
    })}
  </Svg>);
}

const data=[{label:"Grave",value:4,color:"#dc2626"},{label:"Medio",value:3,color:"#d97706"},{label:"Leve",value:1,color:"#ca8a04"},{label:"Pos",value:1,color:"#16a34a"}];

const Doc=(<Document>
<Page size="A4" style={{padding:30}}>
<View style={{flexDirection:"row",flexWrap:"wrap"}}>
<View style={{width:"50%",padding:6}}>
<View style={{borderWidth:1,padding:10}}>
<Text style={{fontSize:9,marginBottom:4}}>IMPACTO</Text>
<VBarChart data={data}/>
</View>
</View>
<View style={{width:"50%",padding:6}}>
<View style={{borderWidth:1,padding:10}}>
<Text>Donut placeholder</Text>
</View>
</View>
</View>
</Page></Document>);
await renderToFile(Doc,"/tmp/svgtest3.pdf"); console.log("done");
