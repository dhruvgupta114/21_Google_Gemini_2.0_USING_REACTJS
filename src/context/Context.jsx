import { createContext, useState } from "react";
import runChat from "../Config/Gemini";

export const Context = createContext()

const ContextProvider = (props) =>{
    const [input, setInput] = useState('')
    const [recentPrompt, setRecentPrompt] = useState('')
    const [previousPrompt, setPreviousPrompt] = useState([])
    const [showResults,setShowResults] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState('')

    const delayPara = (index,nextWord) =>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord)
        },80*index)
    }
    const newChat = ()=>{
        setLoading(false)
        setResultData(false)
    }


    const onSent = async (prompt) =>{
        setResultData('')
        setLoading(true)
        setShowResults(true)
        let response;
        if(prompt!==undefined){
            response = await runChat(prompt)
            setRecentPrompt(prompt)
        }else{
            setPreviousPrompt(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        
        let responseArr = response.split("**");
        let newResponse = '';
        for(let i =0; i<responseArr.length;i++){
            if(i===0 || i%2!==1){
                newResponse += responseArr[i]; 
            }else{
                newResponse += "<b>" +responseArr[i] + "</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArr = newResponse2.split(' ');
        for(let i = 0;i<newResponseArr.length;i++){
            const nextWord = newResponseArr[i]
            delayPara(i,nextWord+ " ")
        }
        setLoading(false)
        setInput('')
    }

    const contextValue = {
        previousPrompt,
        setPreviousPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResults,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider