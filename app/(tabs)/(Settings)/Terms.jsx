import { ScrollView, StyleSheet, Text, View } from "react-native";
<<<<<<< HEAD
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../../context/GlobalProvider";
import Goback from "../../../components/Goback";
import { useScrollToTop } from "../../../context/ScrollToTopProvider";

const Terms = () => {
  const scrollRef = useRef(null);
  const handleScroll = useScrollToTop(scrollRef);
  const { languages } = useGlobalContext();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Goback inline />
        <Text style={styles.headerTitle}>{languages ? "شروط الخدمة" : "Terms & Conditions"}</Text>
      </View>
      {languages ? (
        <ScrollView ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={styles.content} style={styles.container}>
=======
import React from "react";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Terms = () => {
  const { languages } = useGlobalContext();
  return (
    <>
      {languages ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }} style={styles.container}>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          <Text style={styles.title}>شروط الخدمة</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>تاريخ آخر تحديث:</Text> [23-03-2025]
            {"\n\n"}
            باستخدام تطبيق الفرقان، فإنك توافق على شروط الخدمة هذه. إذا لم توافق، يرجى عدم استخدام التطبيق.
            {"\n\n"}
            <Text style={styles.bold}>1. استخدام التطبيق</Text>
            {"\n"}
            - يجب أن يكون عمرك 3 سنوات على الأقل لاستخدام التطبيق.
            {"\n"}
            - توافق على استخدام التطبيق فقط لأغراض قانونية ووفقًا لهذه الشروط.
            {"\n\n"}
            <Text style={styles.bold}>2. التبرعات</Text>
            {"\n"}
            - عند التبرع، سيتم توجيهك إلى PayPal، وهي خدمة خارجية. جميع التبرعات نهائية وغير قابلة للاسترداد.
            {"\n"}
            - أنت مسؤول عن التأكد من دقة معلومات الدفع الخاصة بك على منصة PayPal.
            {"\n\n"}
            <Text style={styles.bold}>3. واجهة برمجة التطبيقات (API) للقرآن</Text>
            {"\n"}
            - يوفر التطبيق وصولًا إلى تلاوات القرآن الصوتية من خلال واجهة برمجة تطبيقات تابعة لطرف ثالث. نحن لسنا مسؤولين عن محتوى أو توفر هذه التلاوات.
            {"\n"}
            - توافق على عدم إساءة استخدام واجهة برمجة التطبيقات أو محاولة الوصول إليها خارج التطبيق.
            {"\n\n"}
            <Text style={styles.bold}>4. الحد من المسؤولية</Text>
            {"\n"}
            - يتم توفير التطبيق "كما هو" دون أي ضمانات من أي نوع. نحن لسنا مسؤولين عن أي أضرار تنشأ عن استخدامك للتطبيق.
            {"\n"}
            - نحن لسنا مسؤولين عن أي مشاكل تتعلق بخدمات الطرف الثالث (مثل PayPal أو واجهة برمجة تطبيقات القرآن).
            {"\n\n"}
            <Text style={styles.bold}>5. الإنهاء</Text>
            {"\n"}
            نحتفظ بالحق في إنهاء أو تعليق وصولك إلى التطبيق في أي وقت، دون إشعار، لأي سبب.
            {"\n\n"}
            <Text style={styles.bold}>6. القانون الحاكم</Text>
            {"\n"}
            تحكم هذه الشروط قوانين الجمهورية الجزائرية الديمقراطية الشعبية. أي نزاعات تنشأ عن استخدامك للتطبيق سيتم حلها في محاكم الجزائر.
            {"\n\n"}
            <Text style={styles.bold}>7. التغييرات على هذه الشروط</Text>
            {"\n"}
            قد نقوم بتحديث شروط الخدمة هذه من وقت لآخر. واستمرارك في استخدام التطبيق يعني قبولك للشروط المحدثة.
            {"\n\n"}
            <Text style={styles.bold}>8. اتصل بنا</Text>
            {"\n"}
            إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا على [Riadzergui20@gmail.com].
          </Text>
        </ScrollView>
      ) : (
<<<<<<< HEAD
        <ScrollView ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={styles.content} style={styles.container}>
=======
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }} style={styles.container}>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Last Updated:</Text> [23-03-2025]
            {"\n\n"}
            By using Furkan App, you agree to these Terms of Service. If you do not agree, please do not use the App.
            {"\n\n"}
            <Text style={styles.bold}>1. Use of the App</Text>
            {"\n"}
            - You must be at least 3 years old to use the App.
            {"\n"}
            - You agree to use the App only for lawful purposes and in compliance with these Terms.
            {"\n\n"}
            <Text style={styles.bold}>2. Donations</Text>
            {"\n"}
            - When donating, you will be redirected to PayPal, a third-party service. All donations are final and non-refundable.
            {"\n"}
            - You are responsible for ensuring the accuracy of your payment information on PayPal.
            {"\n\n"}
            <Text style={styles.bold}>3. Quran API</Text>
            {"\n"}
            - The App provides access to Quranic audio recitations through a third-party API. We are not responsible for the content or availability of these recitations.
            {"\n"}
            - You agree not to misuse the API or attempt to access it outside of the App.
            {"\n\n"}
            <Text style={styles.bold}>4. Limitation of Liability</Text>
            {"\n"}
            - The App is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the App.
            {"\n"}
            - We are not responsible for any issues related to third-party services (e.g., PayPal or the Quran API).
            {"\n\n"}
            <Text style={styles.bold}>5. Termination</Text>
            {"\n"}
            We reserve the right to terminate or suspend your access to the App at any time, without notice, for any reason.
            {"\n\n"}
            <Text style={styles.bold}>6. Governing Law</Text>
            {"\n"}
            These terms are governed by the laws of the People's Democratic Republic of Algeria. Any disputes arising from your use of the app will be resolved in the courts of Algiers, Algeria.
            {"\n\n"}
            <Text style={styles.bold}>7. Changes to These Terms</Text>
            {"\n"}
            We may update these Terms from time to time. Your continued use of the App constitutes acceptance of the updated Terms.
            {"\n\n"}
            <Text style={styles.bold}>8. Contact Us</Text>
            {"\n"}
            If you have any questions about these Terms, please contact us at [Riadzergui20@gmail.com].
          </Text>
        </ScrollView>
      )}
<<<<<<< HEAD
    </SafeAreaView>
=======
    </>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  );
};

export default Terms;

const styles = StyleSheet.create({
<<<<<<< HEAD
  safeArea: { flex: 1, backgroundColor: "#071426" },
  header: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18 },
  headerTitle: { color: "#ffffff", fontSize: 17, fontWeight: "700" },
  container: {
    flex: 1,
    backgroundColor: "#071426",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 150,
  },
  title: {
    color: "#06dce7",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  text: {
    color: "#d8e2f2",
    backgroundColor: "#0b1b35",
    borderColor: "rgba(75,142,224,0.28)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    fontSize: 15,
    lineHeight: 25,
  },
  bold: {
    color: "#ffffff",
    fontWeight: "700",
=======
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
});
