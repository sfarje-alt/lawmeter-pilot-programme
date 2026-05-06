import React from "react";
import { renderToFile, Document, Page, Text, View, Svg, Rect, G, Path, Circle } from "@react-pdf/renderer";

function DonutChart({ data, size=130 }: any) {
  const total = Math.max(1, data.reduce((s:number,d:any)=>s+d.value,0));
  const cx=size/2, cy=size/2, r=size*0.42, rin=r*0.6;
  let acc=0;
  const arcs = data.map((d:any,i:number)=>{
    const start=(acc/total)*Math.PI*2-Math.PI/2;
    acc+=d.value;
    const end=(acc/total)*Math.PI*2-Math.PI/2;
    const large=end-start>Math.PI?1:0;
    const x1=cx+r*Math.cos(start), y1=cy+r*Math.sin(start);
    const x2=cx+r*Math.cos(end), y2=cy+r*Math.sin(end);
    const xi1=cx+rin*Math.cos(end), yi1=cy+rin*Math.sin(end);
    const xi2=cx+rin*Math.cos(start), yi2=cy+rin*Math.sin(start);
    const dPath=`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${rin} ${rin} 0 ${large} 0 ${xi2} ${yi2} Z`;
    return <Path key={i} d={dPath} fill={d.color}/>;
  });
  return <Svg width={size} height={size}>
    {arcs}
    <Circle cx={cx} cy={cy} r={rin-0.5} fill="#fff"/>
  </Svg>;
}
const data=[{label:"PL",value:5,color:"#2b6cb0"},{label:"Normas",value:4,color:"#63b3ed"}];
const Doc=(<Document><Page size="A4" style={{padding:30}}>
<View style={{borderWidth:1, padding:10, width:200}}>
<Text>Donut</Text>
<DonutChart data={data} size={130}/>
</View>
</Page></Document>);
await renderToFile(Doc,"/tmp/svgtest4.pdf"); console.log("done");
