import React from "react";
import { renderToFile, Document, Page, Text, View, Svg, Rect, G } from "@react-pdf/renderer";
const Doc = (
  <Document>
    <Page size="A4" style={{padding:30, fontSize:10}}>
      <View style={{flexDirection:"row", flexWrap:"wrap"}}>
        <View style={{width:"50%", padding:6}}>
          <View style={{borderWidth:1, padding:10}}>
            <Text>Box A</Text>
            <Svg width={230} height={120}>
              <Rect x={0} y={0} width={50} height={50} fill="#1a365d" />
              <G>
                <Rect x={60} y={20} width={50} height={80} fill="#3182ce" />
                <Text x={30} y={70} style={{fontSize:8, fill:"#000"}}>HI</Text>
              </G>
            </Svg>
          </View>
        </View>
        <View style={{width:"50%", padding:6}}>
          <View style={{borderWidth:1, padding:10}}>
            <Text>Box B</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
await renderToFile(Doc, "/tmp/svgtest2.pdf");
console.log("done");
