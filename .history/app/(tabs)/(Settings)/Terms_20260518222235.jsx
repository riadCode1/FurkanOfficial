import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Terms = () => {
  const { languages } = useGlobalContext();
  const ar = !!languages;

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar style="dark" />

      {/* ── header ── */}
      <View style={S.header}>
        <TouchableOpacity style={S.backBtn} onPress={() => router.back()}>
          <MaterialIcons
            name={ar ? "arrow-forward" : "arrow-back"}
            size={24}
            color="#111"
          />
        </TouchableOpacity>
        <Text style={S.headerTitle}>{ar ? "شروط الخدمة" : "Terms of Service"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={S.scroll} style={S.container}>

        <Text style={S.meta}>
          {ar ? "تاريخ آخر تحديث: 23-03-2025" : "Last Updated: 23-03-2025"}
        </Text>

        <Text style={S.intro}>
          {ar
            ? "باستخدام تطبيق الفرقان، فإنك توافق على شروط الخدمة هذه. إذا لم توافق، يرجى عدم استخدام التطبيق."
            : "By using Furqan App, you agree to these Terms of Service. If you do not agree, please do not use the App."}
        </Text>

        {/* 1 */}
        <Text style={S.heading}>{ar ? "١. استخدام التطبيق" : "1. Use of the App"}</Text>
        <Text style={S.body}>
          {ar
            ? "• يجب أن يكون عمرك ٣ سنوات على الأقل لاستخدام التطبيق.\n• توافق على استخدام التطبيق فقط لأغراض قانونية ووفقًا لهذه الشروط."
            : "• You must be at least 3 years old to use the App.\n• You agree to use the App only for lawful purposes and in compliance with these Terms."}
        </Text>

        {/* 2 */}
        <Text style={S.heading}>{ar ? "٢. التبرعات" : "2. Donations"}</Text>
        <Text style={S.body}>
          {ar
            ? "• عند التبرع، سيتم توجيهك إلى PayPal، وهي خدمة خارجية. جميع التبرعات نهائية وغير قابلة للاسترداد.\n• أنت مسؤول عن التأكد من دقة معلومات الدفع الخاصة بك على منصة PayPal."
            : "• When donating, you will be redirected to PayPal, a third-party service. All donations are final and non-refundable.\n• You are responsible for ensuring the accuracy of your payment information on PayPal."}
        </Text>

        {/* 3 */}
        <Text style={S.heading}>{ar ? "٣. واجهة برمجة التطبيقات للقرآن" : "3. Quran API"}</Text>
        <Text style={S.body}>
          {ar
            ? "• يوفر التطبيق وصولًا إلى تلاوات القرآن الصوتية من خلال واجهة برمجة تطبيقات تابعة لطرف ثالث. نحن لسنا مسؤولين عن محتوى أو توفر هذه التلاوات.\n• توافق على عدم إساءة استخدام واجهة برمجة التطبيقات أو محاولة الوصول إليها خارج التطبيق."
            : "• The App provides access to Quranic audio recitations through a third-party API. We are not responsible for the content or availability of these recitations.\n• You agree not to misuse the API or attempt to access it outside of the App."}
        </Text>

        {/* 4 — data collection ── NEW ── */}
        <View style={S.dataBox}>
          <View style={S.dataBoxHeader}>
            <MaterialIcons name="shield" size={18} color="#5b8dee" />
            <Text style={S.dataBoxTitle}>
              {ar ? "٤. البيانات التي نجمعها" : "4. Data We Collect"}
            </Text>
          </View>
          <Text style={S.dataBody}>
            {ar
              ? "نجمع بعض البيانات الشخصية لتحسين تجربتك وتقديم خدماتنا. تشمل هذه البيانات:\n\n• معلومات الحساب: الاسم وعنوان البريد الإلكتروني عند تسجيل الدخول.\n• بيانات الاستخدام: السور والآيات التي تقرأها، والتلاوات التي تستمع إليها، وإشاراتك المرجعية.\n• البيانات التقنية: نوع الجهاز، ونظام التشغيل، وسجلات الأعطال لأغراض استكشاف الأخطاء.\n\nلا نبيع بياناتك أبدًا لأطراف ثالثة. يمكنك طلب حذف بياناتك في أي وقت عبر الاتصال بنا."
              : "We collect some personal data to improve your experience and deliver our services. This includes:\n\n• Account info: your name and email address when you log in.\n• Usage data: surahs and ayahs you read, recitations you listen to, and your bookmarks.\n• Technical data: device type, OS, and crash logs for troubleshooting.\n\nWe never sell your data to third parties. You may request deletion of your data at any time by contacting us."}
          </Text>
        </View>

        {/* 5 */}
        <Text style={S.heading}>{ar ? "٥. الحد من المسؤولية" : "5. Limitation of Liability"}</Text>
        <Text style={S.body}>
          {ar
            ? "• يتم توفير التطبيق «كما هو» دون أي ضمانات. نحن لسنا مسؤولين عن أي أضرار تنشأ عن استخدامك للتطبيق.\n• نحن لسنا مسؤولين عن أي مشاكل تتعلق بخدمات الطرف الثالث (مثل PayPal أو واجهة برمجة تطبيقات القرآن)."
            : "• The App is provided \"as is\" without warranties of any kind. We are not liable for any damages arising from your use of the App.\n• We are not responsible for any issues related to third-party services (e.g., PayPal or the Quran API)."}
        </Text>

        {/* 6 */}
        <Text style={S.heading}>{ar ? "٦. الإنهاء" : "6. Termination"}</Text>
        <Text style={S.body}>
          {ar
            ? "نحتفظ بالحق في إنهاء أو تعليق وصولك إلى التطبيق في أي وقت، دون إشعار، لأي سبب."
            : "We reserve the right to terminate or suspend your access to the App at any time, without notice, for any reason."}
        </Text>

        {/* 7 */}
        <Text style={S.heading}>{ar ? "٧. القانون الحاكم" : "7. Governing Law"}</Text>
        <Text style={S.body}>
          {ar
            ? "تحكم هذه الشروط قوانين الجمهورية الجزائرية الديمقراطية الشعبية. أي نزاعات تنشأ عن استخدامك للتطبيق سيتم حلها في محاكم الجزائر."
            : "These terms are governed by the laws of the People's Democratic Republic of Algeria. Any disputes arising from your use of the App will be resolved in the courts of Algiers, Algeria."}
        </Text>

        {/* 8 */}
        <Text style={S.heading}>{ar ? "٨. التغييرات على هذه الشروط" : "8. Changes to These Terms"}</Text>
        <Text style={S.body}>
          {ar
            ? "قد نقوم بتحديث شروط الخدمة هذه من وقت لآخر. واستمرارك في استخدام التطبيق يعني قبولك للشروط المحدثة."
            : "We may update these Terms from time to time. Your continued use of the App constitutes acceptance of the updated Terms."}
        </Text>

        {/* 9 */}
        <Text style={S.heading}>{ar ? "٩. اتصل بنا" : "9. Contact Us"}</Text>
        <Text style={S.body}>
          {ar
            ? "إذا كانت لديك أي أسئلة حول شروط الخدمة، يرجى الاتصال بنا على Riadzergui20@gmail.com"
            : "If you have any questions about these Terms, please contact us at Riadzergui20@gmail.com"}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Terms;

const S = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#fff" },
  container:    { flex: 1 },
  scroll:       { padding: 20, paddingBottom: 60 },

  // header
  header:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center" },
  headerTitle:  { fontSize: 17, fontWeight: "700", color: "#111" },

  // text
  meta:         { fontSize: 13, color: "#999", marginBottom: 12 },
  intro:        { fontSize: 15, color: "#444", lineHeight: 24, marginBottom: 20 },
  heading:      { fontSize: 16, fontWeight: "700", color: "#111", marginTop: 20, marginBottom: 6 },
  body:         { fontSize: 15, color: "#444", lineHeight: 24 },

  // data collection box
  dataBox:      { marginTop: 20, marginBottom: 4, backgroundColor: "#f0f5ff", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#d0e0ff" },
  dataBoxHeader:{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  dataBoxTitle: { fontSize: 16, fontWeight: "700", color: "#1a3a8f" },
  dataBody:     { fontSize: 14, color: "#2a4a9f", lineHeight: 22 },
});