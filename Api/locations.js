import axios from 'axios'
const API = "https://apis.datos.gob.ar/georef/api"

export async function getProvinces(){
    let provinces = []
    try{
        const res = await axios.get(API+"/provincias")
        provinces = res.data.provincias
    }catch(error){

    }
    return provinces
}

export async function getCities(province){
    let cities = []
    try{
        const res = await axios.get(API+`/localidades?provincia=${province}&campos=nombre&max=100`)
        cities = res.data.localidades
    }catch(error){

    }
    return cities
}