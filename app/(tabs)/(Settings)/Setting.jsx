 import {
   View,
   Text,
   ImageBackground,
   ScrollView,
   Image,
   TouchableOpacity,
   StyleSheet,
   Button,
   Alert,
   TextInput,
 } from "react-native";

 import React, { useEffect, useState } from "react";
 import { SafeAreaView } from "react-native-safe-area-context";
 import { StatusBar } from "expo-status-bar";
 import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

 import { router } from "expo-router";
 import { Modal, Switch, TouchableRipple } from "react-native-paper";
 import { Colors } from "../../../constants/Colors";
 import { useGlobalContext } from "../../../context/GlobalProvider";
 import { usePaymentSheet } from "@stripe/stripe-react-native";

 const Setting = () => {
   const { languages } = useGlobalContext();
   const [isSwitchOn, setIsSwitchOn] = useState(true);
   const [payableAmount, setPayableAmount] = useState(0);

   const [isVisible, setIsVisible] = useState(false);
   const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
     const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();
   const [load, setLoading] = useState(false);

     const API_URL = "https:node-1-gtzm.onrender.com";

     const fetchPaymentSheetParams = async () => {
       const response = await fetch(`${API_URL}/payment-sheet`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           amount: Math.round(parseFloat(payableAmount) * 100),
         }),
       });
       console.log(response);
       const { paymentIntent, ephemeralKey, customer } = await response.json();

       return {
         paymentIntent,
         ephemeralKey,
         customer,
       };
     };

     const initializePaymentSheet = async () => {
     
       const { paymentIntent, ephemeralKey, customer } =
         await fetchPaymentSheetParams();

       const { error } = await initPaymentSheet({
         merchantDisplayName: "riad zer",
         customerId: customer,
         customerEphemeralKeySecret: ephemeralKey,
         paymentIntentClientSecret: paymentIntent,
         
         allowsDelayedPaymentMethods: true,
         defaultBillingDetails: {
           name: "riad Doe",
         },
       });
       if (!error) {
         setLoading(true);
       }
       setLoading(false)
     };

     const openPaymentSheet = async () => {
       const { error } = await presentPaymentSheet();

       if (error) {
         Alert.alert(`Error code: ${error.code}`, error.message);
       } else {
         Alert.alert(
           languages?"تم":"Success",
           languages
             ? " 🕊️بارك الله لك في مالك وأهلك وولدك "
             : "May Allah bless you in your wealth, your family, and your children.🕊️"
         );
       }
     };

   return (
     <SafeAreaView style={styles.container}>
       <StatusBar style="light" backgroundColor="#191845" />

       <ScrollView contentContainerStyle={styles.scrollView}>
         <View style={styles.header}>
           <Text style={styles.headerText}>
             {languages ? "إعدادات" : "Settings"}
           </Text>
         </View>

         <View style={styles.card}>
           <ImageBackground
             resizeMode="cover"
             source={require("../../../assets/images/SplashFK.png")}
             style={styles.imageBackground}
           >
             <View style={styles.imageContent}>
               <Image
                 resizeMode="contain"
                 style={styles.logo}
                 source={require("../../../assets/images/Logo.png")}
               />
               <Text style={styles.supportText}>
                 {languages ? "ادعمنا" : "Support Us"}
               </Text>
               <View style={styles.textContainer}>
                 <Text style={styles.descriptionText}>
                   {languages
                     ? "تم إنشاء تطبيق الفرقان ليتم استخدامه بالكامل مجانًا خالية تماما من الإعلانات، يمكنك دعم عملنا من خلال التبرعات"
                     : "Furqan App is created to be used completely for free with absolutely zero ads, you can support our work through donation"}
                 </Text>
               </View>
             </View>

             <TouchableOpacity
               onPress={() => setIsVisible(true)}
               style={styles.donateButton}
             >
               <Text style={styles.donateButtonText}>
                 {languages ? "تبرع" : "Donate"}
               </Text>
             </TouchableOpacity>
           </ImageBackground>
         </View>

         {/*section 2 */}
         <TouchableRipple
           rippleColor="rgba(200, 200, 200, 0.1)"
           style={styles.touchable}
           onPress={() => {
             router.push({ pathname: `/Languagues/` });
           }}
         >
           <View style={styles.option}>
             <View style={styles.optionTextContainer}>
               <MaterialIcons name="public" size={24} color="white" />
               <Text style={styles.optionText}>
                 {languages ? "اللغات" : "Languages"}
               </Text>
             </View>
             <AntDesign name="right" size={20} color="white" />
           </View>
         </TouchableRipple>

         {/*section 3 */}
         <View style={styles.touchable}>
           <View style={styles.option}>
             <View style={styles.optionTextContainer}>
               <MaterialIcons
                 name="notifications-active"
                 size={24}
                 color="white"
               />
               <Text style={styles.optionText}>
                 {languages ? "إشعارات" : "Notifications"}
               </Text>
             </View>
             <Switch
               color={Colors.blue}
               value={isSwitchOn}
               onValueChange={onToggleSwitch}
             />
           </View>
         </View>

         {/*section 4 */}
         <TouchableRipple
           rippleColor="rgba(200, 200, 200, 0.1)"
           style={styles.touchable}
           onPress={() => {
             router.push({ pathname: `/Privacy/` });
           }}
         >
           <View style={styles.option}>
             <View style={styles.optionTextContainer}>
               <MaterialIcons name="privacy-tip" size={24} color="white" />
               <Text style={styles.optionText}>
                 {languages ? "سياسة الخصوصية" : "Privacy & policy"}
               </Text>
             </View>
             <AntDesign name="right" size={20} color="white" />
           </View>
         </TouchableRipple>

          {/*section 5 */}
          <TouchableRipple
           rippleColor="rgba(200, 200, 200, 0.1)"
           style={styles.touchable}
           onPress={() => {
             router.push({ pathname: `/Terms/` });
           }}
         >
           <View style={styles.option}>
             <View style={styles.optionTextContainer}>
             <MaterialIcons name="fact-check" size={24} color="white" />
               <Text style={styles.optionText}>
                 {languages ? " شروط الخدمة" : "Terms & Conditions  "}
               </Text>
             </View>
             <AntDesign name="right" size={20} color="white" />
           </View>
         </TouchableRipple>

         <Modal
           visible={isVisible}
           animationType="slide"
           transparent={true}
           onRequestClose={() => setIsVisible(false)}
         >
           <View style={styles.modalContainer}>
             <View style={styles.modalContent}>
               <Text style={styles.title}>
                 {languages ? "أدخل مبلغ التبرع" : "Enter Donation Amount"}{" "}
               </Text>

               <TextInput
                 style={styles.input}
                 placeholder="$0.00"
                 keyboardType="numeric"
                 value={payableAmount}
                 onChangeText={setPayableAmount}
                 autoFocus={true}
               />

               <View style={styles.buttonContainer}>
                 <TouchableOpacity
                   style={[styles.button, styles.ButtonD]}
                     onPress={async () => {
                      setLoading(true)
                       await initializePaymentSheet().then(async () => {
                         openPaymentSheet();
                       });
                     }}
                
                 >
                   <Text style={styles.buttonText}>
                    {load? languages? "الرجاء الانتظار...":"Please wait.." : 
                        languages
                       ? "تبرع"
                       : "Donate"}
                   </Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                   style={[styles.button, styles.cancelButton]}
                   onPress={() => setIsVisible(false)}
                 >
                   <Text style={styles.buttonText}>
                     {languages ? "إلغاء" : "Cancel"}
                   </Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         </Modal>
       </ScrollView>
     </SafeAreaView>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: Colors.background,
   },
   scrollView: {
     paddingBottom: 200,
   },
   header: {
     marginTop: 20,
     alignItems: "center",
   },
   headerText: {
     color: "white",
     fontSize: 18,
     fontWeight: "bold",
   },
   card: {
     marginHorizontal: 16,
     marginTop: 36,
     marginBottom: 34,
     height: 228,
     borderRadius: 10,
     overflow: "hidden",
     justifyContent: "center",
   },
   imageBackground: {
     width: "100%",
     height: "100%",
     alignSelf: "center",
   },
   imageContent: {
     alignItems: "center",
   },
   logo: {
     width: 56,
     height: 56,
   },
   supportText: {
     color: "white",
     fontSize: 20,
     fontWeight: "bold",
   },
   textContainer: {
     paddingHorizontal: 16,
     marginTop: 16,

     height: 60,
   },
   descriptionText: {
     color: Colors.textGray,
     textAlign: "center",
   },
   donateButton: {
     width: 310,
     height: 40,
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "#00BCE5",
     borderRadius: 24,
     marginTop: 20,
     alignSelf: "center",
   },
   donateButtonText: {
     color: "white",
     fontSize: 18,
     fontWeight: "bold",
   },
   touchable: {
     flexDirection: "row",
     width: "100%",
     height: 56,
   },
   option: {
     flexDirection: "row",
     alignItems: "center",
     justifyContent: "space-between",
     paddingHorizontal: 20,
     width: "100%",
   },
   optionTextContainer: {
     flexDirection: "row",
     gap: 12,
     alignItems: "center",
   },
   optionText: {
     fontSize: 18,
     color: "white",
   },

   modalContainer: {
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "rgba(0,0,0,0.5)",
   },
   modalContent: {
     width: "80%",
     backgroundColor: "white",
     padding: 20,
     borderRadius: 10,
     alignItems: "center",
   },
   title: {
     fontSize: 18,
     fontWeight: "bold",
     marginBottom: 20,
   },
   input: {
     width: "100%",
     height: 40,
     borderColor: "#ccc",
     borderWidth: 1,
     borderRadius: 5,
     paddingHorizontal: 10,
     marginBottom: 20,
   },
   buttonContainer: {
     gap: 10,
     justifyContent: "space-between",
    
   },
   button: {
     padding: 10,
     borderRadius: 5,
     backgroundColor:"red",
     alignItems: "center",
     justifyContent:"center"
   },
   ButtonD: {
     width: 200,
     height: 40,
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "#00BCE5",
     borderRadius: 10,
     marginTop: 20,
     alignSelf: "center",
   },
   cancelButton: {
     backgroundColor: "#ccc",
     width: 150,
     alignSelf:"center"
   },

   buttonText: {
     color: "white",
     fontWeight: "bold",
   },
 });

 export default Setting;
