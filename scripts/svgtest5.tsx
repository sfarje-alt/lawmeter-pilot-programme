import React from "react";
import { renderToFile, Document, Page, Text, View, Svg, Rect, G, Path, Circle } from "@react-pdf/renderer";

function VBarChart({ data, width=230, height=120 }: any) {
  const pad={l:22,r:8,t:6,b:22};
  const W=width-pad.l-pad.r, H=height-pad.t-pad.b;
  const max=Math.max(1,...data.map((d:any)=>d.value));
  const bw=W/data.length;
  const yTicks=4;
  return (<Svg width={width} height={height}>
    {Array.from({length:yTicks+1}).map((_,i)=>{
      const y=pad.t+(H*i)/yTicks;
      const v=Math.round((max*(yTicks-i))/yTicks);
      return <G key={i}>
        <Path d={`M ${pad.l} ${y} L ${pad.l+W} ${y}`} stroke="#eef2f7" strokeWidth={0.5}/>
        <Text x={pad.l-3} y={y+3} style={{fontSize:6, fill:"#64748b"}} textAnchor="end">{String(v)}</Text>
      </G>;
    })}
    {data.map((d:any,i:number)=>{
      const h=(d.value/max)*H, x=pad.l+i*bw+bw*0.18, y=pad.t+H-h, w=bw*0.64;
      return <G key={i+"b"}>
        <Rect x={x} y={y} width={w} height={h} fill={d.color||"#1a365d"} rx={2}/>
        <Text x={x+w/2} y={y-2} style={{fontSize:6.5, fontFamily:"Helvetica-Bold"}} textAnchor="middle">{String(d.value)}</Text>
        <Text x={x+w/2} y={pad.t+H+10} style={{fontSize:6.5, fill:"#475569"}} textAnchor="middle">{d.label}</Text>
      </G>;
    })}
  </Svg>);
}

function DonutChart({ data, size=130 }: any) {
  const total=Math.max(1,data.reduce((s:number,d:any)=>s+d.value,0));
  const cx=size/2, cy=size/2, r=size*0.42, rin=r*0.6;
  let acc=0;
  const arcs=data.map((d:any,i:number)=>{
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
    <Text x={cx} y={cy-1} style={{fontSize:12,fontFamily:"Helvetica-Bold",fill:"#1a365d"}} textAnchor="middle">{String(total)}</Text>
    <Text x={cx} y={cy+9} style={{fontSize:6.5,fill:"#64748b"}} textAnchor="middle">ALERTAS</Text>
  </Svg>;
}

const impactDist=[{label:"Grave",value:4,color:"#dc2626"},{label:"Medio",value:3,color:"#d97706"},{label:"Leve",value:1,color:"#ca8a04"},{label:"Positivo",value:1,color:"#16a34a"}];
const typeDist=[{label:"PL",value:5,color:"#2b6cb0"},{label:"Normas",value:4,color:"#63b3ed"}];

const Doc=(<Document><Page size="A4" style={{padding:30,fontSize:10}}>
<View style={{flexDirection:"row",flexWrap:"wrap"}}>
<View style={{width:"50%",padding:6}}>
<View style={{borderWidth:1,padding:10}}>
<Text style={{fontSize:9,marginBottom:4,fontFamily:"Helvetica-Bold"}}>IMPACTO</Text>
<VBarChart data={impactDist}/>
</View>
</View>
<View style={{width:"50%",padding:6}}>
<View style={{borderWidth:1,padding:10}}>
<Text style={{fontSize:9,marginBottom:4,fontFamily:"Helvetica-Bold"}}>TIPO</Text>
<View style={{flexDirection:"row",alignItems:"center"}}>
<DonutChart data={typeDist} size={130}/>
<View style={{marginLeft:12,flex:1}}><Text>Legend</Text></View>
</View>
</View>
</View>
</View>
</Page></Document>);
await renderToFile(Doc,"/tmp/svgtest5.pdf"); console.log("done");
