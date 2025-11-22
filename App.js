import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions } from "react-native"
import { Accelerometer } from "expo-sensors"


const D = Dimensions.get("window")
const SW = D.width
const SH = D.height

// new dimensions
const CHAR_W = 45
const CHAR_H = 75
const DROP_W = 55
const DROP_H = 45



export default function App(){

    const [manX, setManX] = useState((SW-CHAR_W)/2)
    const [fallz, setFallz] = useState([])
    const [end, setEnd] = useState(false)


    const reset = ()=> { setFallz([]); setEnd(false) }




    //tilt 
    useEffect(()=>{
        Accelerometer.setUpdateInterval(19)

        const X = Accelerometer.addListener((g)=>{
            setManX(xx=>{
                let p = xx + (g.x * 29)
                if(p<0) p=0
                if(p>SW-CHAR_W) p=SW-CHAR_W
                return p
            })
        })

        return ()=>X.remove()
    },[])



    // spawn objects
    useEffect(()=>{
        if(end) return

        const r = setInterval(()=>{
            setFallz(a=>[
                ...a,
                {
                    id: Date.now() + Math.random(),
                    lx: Math.random()*(SW-DROP_W),
                    ly: SH + 100
                }
            ])
        }, 820)

        return ()=>clearInterval(r)
    },[end])




    // falling down
    useEffect(()=>{
        if(end) return

        const ft = setInterval(()=>{
            setFallz(z=> z.map(d=>({
                ...d,
                ly: d.ly - 13
            })).filter(d=>d.ly>-120))
        }, 48)

        return ()=>clearInterval(ft)
    },[end])





    // crash?
    useEffect(()=>{

        const pL = manX
        const pR = manX + CHAR_W
        const pB = 35
        const pT = pB + CHAR_H

        fallz.forEach(d=>{
            let L = d.lx
            let R = d.lx + DROP_W
            let B = d.ly
            let T = d.ly + DROP_H

            if( R>pL && L<pR && T>=pB && B<=pT ){
                setEnd(true)
            }
        })

    }, [fallz, manX])





    return(
        <TouchableWithoutFeedback onPress={reset}>
            <View style={styles.main}>


                {fallz.map(o=>(
                    <View key={o.id} style={[styles.drp,{left:o.lx, bottom:o.ly}]} />
                ))}


                {!end && (
                    <View style={[styles.char,{left:manX}]} />
                )}


                {end && (
                    <Text style={styles.over}>Tap to Retry</Text>
                )}

                <Text style={styles.tip}>Tilt Phone</Text>

            </View>
        </TouchableWithoutFeedback>
    )
}





const styles = StyleSheet.create({
    main:{
        flex:1,
        backgroundColor:"#000",
        justifyContent:"flex-end"
    },

    char:{
        position:"absolute",
        bottom:35,
        width:CHAR_W,
        height:CHAR_H,
        backgroundColor:"#44f",
        borderWidth:2,
        borderColor:"#fff",
        borderRadius:8
    },

    drp:{
        position:"absolute",
        width:DROP_W,
        height:DROP_H,
        backgroundColor:"#ff5050",
        borderRadius:3
    },

    over:{
        position:"absolute",
        top:SH/2-30,
        color:"#fff",
        fontSize:25
    },

    tip:{
        position:"absolute",
        top:40,
        color:"#888"
    }
})