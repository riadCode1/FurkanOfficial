import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Privacy = () => {
  const { languages } = useGlobalContext();

  return (
    <>
      {languages ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }} style={styles.container}>
          <Text style={styles.title}>سياسة الخصوصية</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>تاريخ آخر تحديث:</Text> [23-03-2025]
            {"\n\n"}
            نشكرك على استخدام تطبيق الفرقان. توضح سياسة الخصوصية هذه كيفية تعاملنا مع معلوماتك. باستخدام التطبيق، فإنك توافق على الشروط الواردة في هذه السياسة.
            {"\n\n"}
            <Text style={styles.bold}>1. المعلومات التي نجمعها</Text>
            {"\n"}
            تطبيق الفرقان لا يجمع أو يخزن أو يشارك أي بيانات شخصية للمستخدمين.
            {"\n\n"}
            <Text style={styles.bold}>أ. التلاوات الصوتية</Text>
            {"\n"}
            يستخدم التطبيق واجهة برمجة تطبيقات عامة للقرآن لبث التلاوات الصوتية. لا يتم تتبع أو تسجيل أي نشاط من أنشطة المستخدم.
            {"\n\n"}
            <Text style={styles.bold}>ب. التبرعات</Text>
            {"\n"}
            يحتوي التطبيق على زر للتبرع يقوم بإعادة التوجيه إلى موقع PayPal للتبرع. تتم جميع المعاملات عبر منصة PayPal الآمنة، ولا نقوم بجمع أو تخزين أي بيانات شخصية أو معلومات دفع.
            {"\n\n"}
            <Text style={styles.bold}>2. كيفية استخدام المعلومات</Text>
            {"\n"}
            بما أننا لا نجمع أي معلومات شخصية، فإننا لا نستخدم أو نعالج أي بيانات تتعلق بالمستخدم.
            {"\n\n"}
            <Text style={styles.bold}>3. خدمات الطرف الثالث</Text>
            {"\n"}
            - <Text style={styles.bold}>PayPal:</Text> يُستخدم فقط كمنصة تبرع عبر رابط خارجي. الرجاء الرجوع إلى سياسة الخصوصية الخاصة بـ PayPal.
            {"\n"}
            - <Text style={styles.bold}>واجهة برمجة تطبيقات القرآن:</Text> تُستخدم لبث التلاوات الصوتية فقط. لا يتم تسجيل أو تتبع أي بيانات استخدام.
            {"\n\n"}
            <Text style={styles.bold}>4. أمان البيانات</Text>
            {"\n"}
            بما أننا لا نجمع أي بيانات، فلا حاجة لتدابير أمنية لحماية معلومات شخصية. أي تبرعات تتم عبر PayPal تتم عبر بنيتهم التحتية الآمنة.
            {"\n\n"}
            <Text style={styles.bold}>5. خصوصية الأطفال</Text>
            {"\n"}
            التطبيق مناسب لجميع الأعمار ولا يجمع أي معلومات شخصية من المستخدمين، بما في ذلك الأطفال.
            {"\n\n"}
            <Text style={styles.bold}>6. التغييرات على هذه السياسة</Text>
            {"\n"}
            قد نقوم بتحديث سياسة الخصوصية هذه في المستقبل. سيتم نشر جميع التغييرات في هذه الصفحة مع تاريخ "آخر تحديث" محدث.
            {"\n\n"}
            <Text style={styles.bold}>7. اتصل بنا</Text>
            {"\n"}
            إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني التالي: [Riadzergui20@gmail.com].
          </Text>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }} style={styles.container}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Last Updated:</Text> [23-03-2025]
            {"\n\n"}
            Thank you for using Furkan App. This Privacy Policy explains how we handle your information. By using the App, you agree to the terms outlined in this policy.
            {"\n\n"}
            <Text style={styles.bold}>1. Information We Collect</Text>
            {"\n"}
            Furkan App does <Text style={styles.bold}>not collect, store, or share any personal user data</Text>.
            {"\n\n"}
            <Text style={styles.bold}>a. Audio Content</Text>
            {"\n"}
            The app uses a public Quran API to stream audio recitations. No information about your activity is tracked or stored.
            {"\n\n"}
            <Text style={styles.bold}>b. Donations</Text>
            {"\n"}
            We use a simple donation button that links to <Text style={styles.bold}>PayPal’s donation website</Text>. All donation transactions are handled directly on PayPal’s secure platform. We do not collect or store any personal or payment data.
            {"\n\n"}
            <Text style={styles.bold}>2. How We Use Your Information</Text>
            {"\n"}
            Since we do not collect any personal information, we do not use or process user data in any way.
            {"\n\n"}
            <Text style={styles.bold}>3. Third-Party Services</Text>
            {"\n"}
            - <Text style={styles.bold}>PayPal:</Text> Used only as a donation platform via external link. Please refer to PayPal’s own Privacy Policy.
            {"\n"}
            - <Text style={styles.bold}>Quran API:</Text> Used to stream audio recitations. We do not track or log any usage data from this service.
            {"\n\n"}
            <Text style={styles.bold}>4. Data Security</Text>
            {"\n"}
            Since no user data is collected or stored, no security measures are necessary for personal data. Any donations made via PayPal are protected by PayPal’s own secure infrastructure.
            {"\n\n"}
            <Text style={styles.bold}>5. Children’s Privacy</Text>
            {"\n"}
            The App is suitable for all ages and does not knowingly collect any personal information from users, including children.
            {"\n\n"}
            <Text style={styles.bold}>6. Changes to This Policy</Text>
            {"\n"}
            We may update this Privacy Policy in the future. All changes will be posted on this page with a revised "Last Updated" date.
            {"\n\n"}
            <Text style={styles.bold}>7. Contact Us</Text>
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
