const cleanup = (string) => {
  return "#" + string.trim().toLowerCase().replace(/[^a-ząćęłńóśżź0-9]/g, "")
};
const normalize = (string) => {
  let original = ["Ą", "ą", "Ć", "ć", "Ę", "ę", "Ł", "ł", "Ń", "ń", "Ó", "ó", "Ś", "ś", "Ź", "ź", "Ż", "ż"];
  let normalized = ["A", "a", "C", "c", "E", "e", "L", "l", "N", "n", "O", "o", "S", "s", "Z", "z", "Z", "z"];
  let index; 
  return string.split("").map((char)=>(index=original.indexOf(char.toString())) && (index>0?normalized[index]:char)).join("");
}
const distance = (lat1, lon1, lat2, lon2) => {
  lon1 =  parseFloat(lon1) * Math.PI / 180;
  lon2 = parseFloat(lon2) * Math.PI / 180;
  lat1 = parseFloat(lat1) * Math.PI / 180;
  lat2 = parseFloat(lat2) * Math.PI / 180;
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat/2), 2)+Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin(dlon/2),2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let r = 6371;
  let output = c * r;
  output = Math.round(output*10)/10;
  return(output);
}
const globals = {
  //proxy: 'https://api.codetabs.com/v1/proxy/?quest=https://api.gios.gov.pl/pjp-api/rest',
  proxy: 'https://api.allorigins.win/raw?url=https://api.gios.gov.pl/pjp-api/rest',
  stations: '/station/findAll',
  sensors: '/station/sensors',
  index: '/aqindex/getIndex',
  data: '/data/getData',
}
const colorIndicator = {
  verygood:{rgb:'88,177,9',hex:'#58b109'},
  good:{rgb:'176,221,16',hex:'#b0dd10'},
  moderate:{rgb:'255,217,18',hex:'#ffd912'},
  sufficient:{rgb:'228,129,0',hex:'#e48100'},
  bad:{rgb:'229,0,0',hex:'#e50000'},
  verybad:{rgb:'154,0,1',hex:'#9a0001'},
}
const sensorsScale = {
  pm10: {ranges: [20, 50, 80, 110, 150], name: 'pm10', title: 'particulate matter'},
  pm25: {ranges: [13, 35, 55, 75, 110], name: 'pm2.5', title: 'particulate matter'},
  so2: {ranges: [50, 100, 200, 350, 500], name: 'so2', title: 'sulphur dioxide'},
  no2: {ranges: [40, 100, 150, 230, 400], name: 'no2', title: 'nitrogen dioxide'},
  o3: {ranges: [70, 120, 150, 180, 240], name: 'o3', title: 'ozone'},
  co: {ranges: [], name: 'co', title: 'carbon monoxide'},
  c6h6: {ranges: [], name: 'c6h6', title: 'benzene'},
}
export {cleanup, normalize, distance, globals, colorIndicator, sensorsScale};