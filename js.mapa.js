import { createClient }
from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

import {
SUPABASE_URL,
SUPABASE_KEY
}
from './config.js';

const supabase =
createClient(
SUPABASE_URL,
SUPABASE_KEY
);

const map =
L.map('map')
.setView([-14.235,-51.925],4);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);

let marcadores = {};

async function carregarMotoristas(){

const { data } =
await supabase
.from('motoristas')
.select('*');

data.forEach(motorista=>{

const pos = [
motorista.latitude,
motorista.longitude
];

const marker =
L.marker(pos)
.addTo(map)
.bindPopup(motorista.nome);

marcadores[motorista.id] =
marker;

});

}

await carregarMotoristas();

supabase
.channel('motoristas')

.on(
'postgres_changes',
{
event:'UPDATE',
schema:'public',
table:'motoristas'
},
(payload)=>{

const m =
payload.new;

const pos = [
m.latitude,
m.longitude
];

if(marcadores[m.id]){

marcadores[m.id]
.setLatLng(pos);

}else{

marcadores[m.id] =
L.marker(pos)
.addTo(map)
.bindPopup(m.nome);

}

}
)

.subscribe();