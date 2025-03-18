// apiService.js


import axios from 'axios';



const URL = 'https://api.quran.com/api/v4'; 

const ReciterEndpoint = `${URL}/resources/recitations` 
const chaptersEndpoint = `${URL}/chapters` ;
const SearchEndpoint = `${URL}/search`


export const AudioReciterEndpoint = id => id ? `${URL}/chapter_recitations/${id}` : null;
export const ChapterIDEndpoint = id => id ? `${URL}/chapters/${id}` : null;
export const ChapterInfoEndpoint = id => id ? `${URL}/chapters/${id}/info` : null;
export const ChapterReciterEndpoint = (id1, id2) =>  id1 && id2 ? `${URL}/chapter_recitations/${id1}/${id2}` : null;
 

const apicalls = async (endpoint, params) => {

 

  const options = {
      method: 'GET',
      url: endpoint,
      params:  {
        language :"ar"
      }

  }

  try {
      const response = await axios.request(options);
      return response.data;
  } catch (error) {
      console.log('error', error)
      return {}
  }
}




export const fetchSuwar = () => {
  return apicalls(ReciterEndpoint)
}


export const fetchChater = () => {
  return apicalls(chaptersEndpoint)
}

export const fetchSearch = params => {
  return apicalls(SearchEndpoint,params)
}

export const fetchAudio = (id) => {
  return apicalls(AudioReciterEndpoint(id))
}

export const fetChapterID = (id) => {
  return apicalls(ChapterIDEndpoint(id))
}


export const fetChapterInfo = (id) => {
  return apicalls(ChapterInfoEndpoint(id))
}

export const fetchChapterReciter = (id1,id2) => {
  return apicalls(ChapterReciterEndpoint(id1,id2))
}





