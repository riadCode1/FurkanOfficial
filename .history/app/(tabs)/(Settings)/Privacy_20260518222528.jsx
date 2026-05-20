import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Privacy = () => {
  const { languages } = useGlobalContext();
  const ar = !!languages;

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar style="dark" />

      {/* ── header ── */}
      <View style={S.header}>
        <TouchableOpacity style={S.backBtn} onPress={() => router.back()}>
          <MaterialIcons name={ar ? "arrow-forward" : "arrow-back"} size={24} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>{ar ? "سياسة الخصوصية" : "Privacy Policy"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={S.scroll} style={S.container}>

        <Text style={S.meta}>
          {ar ? "تاريخ آخر تحديث: 23-03-2025" : "Last Updated: 23-03-2025"}
        </Text>

        <Text style={S.intro}>
          {ar
            ? "نشكرك على استخدام تطبيق الفرقان. توضح سياسة الخصوصية هذه كيفية تعاملنا مع معلوماتك. باستخدام التطبيق، فإنك توافق على الشروط الواردة في هذه السياسة."
            : "Thank you for using Furqan App. This Privacy Policy explains how we handle your information. By using the App, you agree to the terms outlined in this policy."}
        </Text>

        {/* 1 */}
        <Text style={S.heading}>{ar ? "١. المعلومات التي نجمعها" : "1. Information We Collect"}</Text>

        {/* data collection box */}
        <View style={S.dataBox}>
          <View style={S.dataBoxHeader}>
            <MaterialIcons name="shield" size={18} color="#5b8dee" />
            <Text style={S.dataBoxTitle}>
              {ar ? "البيانات التي يجمعها التطبيق" : "Data Collected by the App"}
            </Text>
          </View>
          <Text style={S.dataBody}>
            {ar
              ? "يجمع تطبيق الفرقان بعض البيانات لتحسين تجربتك وتقديم الخدمات. تشمل هذه البيانات:\n\n• معلومات الحساب: الاسم وعنوان البريد الإلكتروني عند تسجيل الدخول.\n• بيانات الاستخدام: السور والآيات التي تقرأها، والتلاوات التي تستمع إليها، وإشاراتك المرجعية.\n• البيانات التقنية: نوع الجهاز، ونظام التشغيل، وسجلات الأعطال لأغراض استكشاف الأخطاء.\n\nلا نبيع بياناتك أبدًا لأطراف ثالثة. يمكنك طلب حذف بياناتك في أي وقت عبر التواصل معنا."
              : "Furqan App collects some data to improve your experience and deliver our services. This includes:\n\n• Account info: your name and email address when you log in.\n• Usage data: surahs and ayahs you read, recitations you listen to, and your bookmarks.\n• Technical data: device type, OS, and crash logs for troubleshooting.\n\nWe never sell your data to third parties. You may request deletion of your data at any time by contacting us."}
          </Text>
        </View>

        {/* 1a */}
        <Text style={S.subheading}>{ar ? "أ. التلاوات الصوتية" : "a. Audio Content"}</Text>
        <Text style={S.body}>
          {ar
            ? "يستخدم التطبيق واجهة برمجة تطبيقات عامة للقرآن لبث التلاوات الصوتية. لا يتم تتبع أو تسجيل أي نشاط من أنشطة المستخدم."
            : "The App uses a public Quran API to stream audio recitations. No information about your activity is tracked or stored."}
        </Text>

        {/* 1b */}
        <Text style={S.subheading}>{ar ? "ب. التبرعات" : "b. Donations"}</Text>
        <Text style={S.body}>
          {ar
            ? "يحتوي التطبيق على زر للتبرع يقوم بإعادة التوجيه إلى PayPal. تتم جميع المعاملات عبر منصة PayPal الآمنة، ولا نقوم بجمع أو تخزين أي بيانات شخصية أو معلومات دفع."
            : "The App includes a donation button that links to PayPal's donation website. All transactions are handled on PayPal's secure platform. We do not collect or store any personal or payment data."}
        </Text>

        {/* 2 */}
        <Text style={S.heading}>{ar ? "٢. كيفية استخدام المعلومات" : "2. How We Use Your Information"}</Text>
        <Text style={S.body}>
          {ar
            ? "نستخدم البيانات التي نجمعها فقط لتقديم وتحسين خدمات التطبيق، مثل حفظ تقدمك وتخصيص تجربتك. لا نستخدم بياناتك لأغراض تجارية أو إعلانية."
            : "We use the data we collect only to provide and improve the App's services, such as saving your progress and personalising your experience. We do not use your data for commercial or advertising purposes."}
        </Text>

        {/* 3 */}
        <Text style={S.heading}>{ar ? "٣. خدمات الطرف الثالث" : "3. Third-Party Services"}</Text>
        <Text style={S.body}>
          {ar
            ? "• PayPal: يُستخدم فقط كمنصة تبرع عبر رابط خارجي. الرجاء الرجوع إلى سياسة الخصوصية الخاصة بـ PayPal.\n• واجهة برمجة تطبيقات القرآن: تُستخدم لبث التلاوات الصوتية فقط. لا يتم تسجيل أو تتبع أي بيانات استخدام."
            : "• PayPal: Used only as a donation platform via external link. Please refer to PayPal's own Privacy Policy.\n• Quran API: Used to stream audio recitations only. We do not track or log any usage data from this service."}
        </Text>

        {/* 4 */}
        <Text style={S.heading}>{ar ? "٤. أمان البيانات" : "4. Data Security"}</Text>
        <Text style={S.body}>
          {ar
            ? "نتخذ تدابير معقولة لحماية بياناتك. أي تبرعات تتم عبر PayPal محمية ببنيتهم التحتية الآمنة."
            : "We take reasonable measures to protect your data. Any donations made via PayPal are protected by PayPal's own secure infrastructure."}
        </Text>

        {/* 5 */}
        <Text style={S.heading}>{ar ? "٥. خصوصية الأطفال" : "5. Children's Privacy"}</Text>
        <Text style={S.body}>
          {ar
            ? "التطبيق مناسب لجميع الأعمار. نلتزم بعدم جمع أي بيانات شخصية من الأطفال دون موافقة ولي الأمر."
            : "The App is suitable for all ages. We are committed to not collecting personal data from children without parental consent."}
        </Text>

        {/* 6 */}
        <Text style={S.heading}>{ar ? "٦. التغييرات على هذه السياسة" : "6. Changes to This Policy"}</Text>
        <Text style={S.body}>
          {ar
            ? "قد نقوم بتحديث سياسة الخصوصية هذه في المستقبل. سيتم نشر جميع التغييرات في هذه الصفحة مع تاريخ «آخر تحديث» محدث."
            : "We may update this Privacy Policy in the future. All changes will be posted on this page with a revised \"Last Updated\" date."}
        </Text>

        {/* 7 */}
        <Text style={S.heading}>{ar ? "٧. اتصل بنا" : "7. Contact Us"}</Text>
        <Text style={S.body}>
          {ar
            ? "إذا كانت لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا على Riadzergui20@gmail.com"
            : "If you have any questions about this Privacy Policy, please contact us at Riadzergui20@gmail.com"}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Privacy;

const S = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#fff" },
  container:    { flex: 1 },
  scroll:       { padding: 20, paddingBottom: 100 },

  // header
  header:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center" },
  headerTitle:  { fontSize: 17, fontWeight: "700", color: "#111" },

  // text
  meta:         { fontSize: 13, color: "#999", marginBottom: 12 },
  intro:        { fontSize: 15, color: "#444", lineHeight: 24, marginBottom: 20 },
  heading:      { fontSize: 16, fontWeight: "700", color: "#111", marginTop: 20, marginBottom: 6 },
  subheading:   { fontSize: 15, fontWeight: "600", color: "#333", marginTop: 14, marginBottom: 4 },
  body:         { fontSize: 15, color: "#444", lineHeight: 24 },

  // data collection box
  dataBox:      { marginTop: 12, marginBottom: 16, backgroundColor: "#f0f5ff", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#d0e0ff" },
  dataBoxHeader:{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  dataBoxTitle: { fontSize: 16, fontWeight: "700", color: "#1a3a8f" },
  dataBody:     { fontSize: 14, color: "#2a4a9f", lineHeight: 22 },
});