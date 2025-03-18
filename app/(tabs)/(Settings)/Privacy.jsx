import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Privacy  = () => {
  const { languages } = useGlobalContext();
  return (
    <>
      {languages ? (
         <ScrollView contentContainerStyle={{paddingBottom:200}} style={styles.container}>
      <Text style={styles.title}>سياسة الخصوصية</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>تاريخ آخر تحديث:</Text> [أدخل التاريخ]
        {"\n\n"}
        نشكرك على استخدام تطبيق الفرقان 
        . توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحماية معلوماتك عند استخدام التطبيق. باستخدام التطبيق، فإنك توافق على الشروط الواردة في هذه السياسة.
        {"\n\n"}
        <Text style={styles.bold}>1. المعلومات التي نجمعها</Text>
        {"\n"}
        <Text style={styles.bold}>أ. المعلومات الشخصية</Text>
        {"\n"}
        - <Text style={styles.bold}>معلومات التبرع:</Text> عند إجراء تبرع عبر Stripe، نجمع اسمك وعنوان بريدك الإلكتروني ومعلومات الدفع وعنوان الفوترة. يتم معالجة هذه المعلومات بشكل آمن من قبل Stripe ولا يتم تخزينها على خوادمنا.
        {"\n"}
       
        <Text style={styles.bold}>ب. بيانات الاستخدام</Text>
        {"\n"}
        - <Text style={styles.bold}>استخدام التطبيق:</Text> نجمع معلومات حول كيفية تفاعلك مع التطبيق، مثل القراء الذين تستمع إليهم، ومدة الجلسات، وأي أخطاء أو أعطال.
        {"\n"}
        - <Text style={styles.bold}>معلومات الجهاز:</Text> قد نجمع معلومات خاصة بالجهاز، مثل طراز الجهاز ونظام التشغيل والمعرّفات الفريدة للجهاز.
        {"\n\n"}
        <Text style={styles.bold}>ج. بيانات واجهة برمجة التطبيقات (API) للقرآن</Text>
        {"\n"}
        - <Text style={styles.bold}>التلاوات الصوتية:</Text> يتكامل التطبيق مع واجهة برمجة تطبيقات القرآن لتوفير تلاوات صوتية. نحن لا نجمع أو نخزن محتوى هذه التلاوات، ولكن قد نسجل بيانات الاستخدام (مثل القراء أو الآيات التي يتم الوصول إليها).
        {"\n\n"}
        <Text style={styles.bold}>2. كيفية استخدامنا لمعلوماتك</Text>
        {"\n"}
        - لمعالجة التبرعات وتقديم إيصالات عبر Stripe.
        {"\n"}
        - لتحسين وظائف التطبيق وتجربة المستخدم.
        {"\n"}
        - للرد على استفساراتك أو طلبات الدعم.
        {"\n"}
        - لإرسال التحديثات أو العروض الترويجية أو معلومات أخرى (إذا وافقت على ذلك).
        {"\n\n"}
        <Text style={styles.bold}>3. كيفية مشاركة معلوماتك</Text>
        {"\n"}
        - <Text style={styles.bold}>خدمات الطرف الثالث:</Text> نستخدم Stripe لمعالجة المدفوعات وواجهة برمجة تطبيقات القرآن للتلاوات الصوتية. لدى هذه الأطراف الثالثة سياسات خصوصية خاصة بها، ونحن نشجعك على مراجعتها.
        {"\n"}
        - <Text style={styles.bold}>المتطلبات القانونية:</Text> قد نكشف عن معلوماتك إذا طُلب منا ذلك بموجب القانون أو لحماية حقوقنا وسلامتنا.
        {"\n\n"}
        <Text style={styles.bold}>4. أمان البيانات</Text>
        {"\n"}
        ننفذ إجراءات أمان قياسية في الصناعة لحماية معلوماتك. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100%.
        {"\n\n"}
        <Text style={styles.bold}>5. حقوقك</Text>
        {"\n"}
        - يمكنك طلب الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها.
        {"\n"}
        - يمكنك إلغاء الاشتراك في تلقي رسائل البريد الإلكتروني الترويجية.
        {"\n\n"}
        <Text style={styles.bold}>6. خصوصية الأطفال</Text>
        {"\n"}
        التطبيق غير مخصص للأطفال دون سن 3 عامًا. نحن لا نجمع معلومات شخصية من الأطفال دون سن 3 عامًا عن علم.
        {"\n\n"}
        <Text style={styles.bold}>7. التغييرات على هذه السياسة</Text>
        {"\n"}
        قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. وسنخطرك بأي تغييرات عن طريق نشر السياسة الجديدة على هذه الصفحة.
        {"\n\n"}
        <Text style={styles.bold}>8. اتصل بنا</Text>
        {"\n"}
        إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على [ Riadzergui20@gmail.com ].
      </Text>

      
    </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{paddingBottom:200}} style={styles.container}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Last Updated:</Text> [Insert Date]
          {"\n\n"}
          Thank you for using Furkan App. This Privacy Policy explains how we collect, use, and protect your information when you use our App. By using the App, you agree to the terms outlined in this policy.
          {"\n\n"}
          <Text style={styles.bold}>1. Information We Collect</Text>
          {"\n"}
          <Text style={styles.bold}>a. Personal Information</Text>
          {"\n"}
          - <Text style={styles.bold}>Donation Information:</Text> When you make a donation through Stripe, we collect your name, email address, payment information, and billing address. This information is processed securely by Stripe and is not stored on our servers.
          {"\n"}
          
          <Text style={styles.bold}>b. Usage Data</Text>
          {"\n"}
          - <Text style={styles.bold}>App Usage:</Text> We collect information about how you interact with the App, such as the audio reciters you listen to, the duration of your sessions, and any errors or crashes.
          {"\n"}
          - <Text style={styles.bold}>Device Information:</Text> We may collect device-specific information, such as your device model, operating system, and unique device identifiers.
          {"\n\n"}
          <Text style={styles.bold}>c. Quran API Data</Text>
          {"\n"}
          - <Text style={styles.bold}>Audio Recitations:</Text> The App integrates with a Quran API to provide audio recitations. We do not collect or store the content of these recitations, but we may log usage data (e.g., which reciters or verses are accessed).
          {"\n\n"}
          <Text style={styles.bold}>2. How We Use Your Information</Text>
          {"\n"}
          - To process donations and provide receipts via Stripe.
          {"\n"}
          - To improve the App's functionality and user experience.
          {"\n"}
          - To respond to your inquiries or support requests.
          {"\n"}
          - To send you updates, promotions, or other information (if you opt-in).
          {"\n\n"}
          <Text style={styles.bold}>3. How We Share Your Information</Text>
          {"\n"}
          - <Text style={styles.bold}>Third-Party Services:</Text> We use Stripe for payment processing and a Quran API for audio recitations. These third parties have their own privacy policies, and we encourage you to review them.
          {"\n"}
          - <Text style={styles.bold}>Legal Requirements:</Text> We may disclose your information if required by law or to protect our rights and safety.
          {"\n\n"}
          <Text style={styles.bold}>4. Data Security</Text>
          {"\n"}
          We implement industry-standard security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure.
          {"\n\n"}
          <Text style={styles.bold}>5. Your Rights</Text>
          {"\n"}
          - You can request access to, correction, or deletion of your personal data.
          {"\n"}
          - You can opt-out of receiving promotional emails.
          {"\n\n"}
          <Text style={styles.bold}>6. Children’s Privacy</Text>
          {"\n"}
          The App is not intended for children under 3. We do not knowingly collect personal information from children under 3.
          {"\n\n"}
          <Text style={styles.bold}>7. Changes to This Policy</Text>
          {"\n"}
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          {"\n\n"}
          <Text style={styles.bold}>8. Contact Us</Text>
          {"\n"}
          If you have any questions about this Privacy Policy, please contact us at [Riadzergui20@gmail.com].
        </Text>
  
       
      </ScrollView>
      )}
    </>
  );
};

export default Privacy;

const styles = StyleSheet.create({

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
  },
});
