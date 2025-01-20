import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress';



let { width, height } = Dimensions.get("window")

const Loadingscreen = () => {
    return (
        <View style={{ width: width, height: height }} className='absolute flex-row justify-center items-center'>
            <Progress.CircleSnail size={160} thickness={12} color="red" />
        </View>
    )
}

export default Loadingscreen