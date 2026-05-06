import React from "react";
import { renderToFile, Document, Page, Text, View, Svg, Rect, G, Path, Circle } from "@react-pdf/renderer";
const Doc = (
  <Document>
    <Page size="A4" style={{padding:30}}>
      <Text>SVG Test</Text>
      <View style={{borderWidth:1, borderColor:"red", padding:10}}>
        <Svg width={300} height={200}>
          <Rect x={10} y={10} width={100} height={50} fill="#1a365d" />
          <Rect x={120} y={10} width={80} height={120} fill="#3182ce" />
          <Circle cx={250} cy={100} r={40} fill="#16a34a" />
          <Path d="M 10 180 L 290 180" stroke="#000" strokeWidth={2} />
        </Svg>
      </View>
    </Page>
  </Document>
);
await renderToFile(Doc, "/tmp/svgtest.pdf");
console.log("done");
