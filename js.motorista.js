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

const MOTORISTA_ID =
prompt("Digite o ID do motorista");

const status =
document.getElementById('status');

navigator.geolocation.watchPosition(

async(pos)=>{

const lat =
pos.coords.latitude;

const lng =
pos.coords.longitude;

status.innerHTML =
`
Latitude: ${lat}<br>
Longitude: ${lng}
`;

await supabase
.from('motoristas')
.update({
latitude:lat,
longitude:lng,
atualizado_em:new Date()
})
.eq('id',MOTORISTA_ID);

},

(err)=>{

status.innerHTML =
err.message;

},

{
enableHighAccuracy:true
}

);