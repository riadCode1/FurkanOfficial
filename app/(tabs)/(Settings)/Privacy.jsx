import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Privacy  = () => {
  const { languages } = useGlobalContext();
  return (
    <>
      {languages ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
          <View>
            <Text style={[styles.boldTextAr]}>الخصوصية والسياسة</Text>
            <Text style={styles.boldTextAr}>
              تاريخ النفاذ:{" "}
              <Text style={{ fontWeight: "300", fontSize: 14 }}>
                2 فبراير 2025
              </Text>
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <Text style={{textAlign:"right", lineHeight: 23 }}>
              <Text style={{ fontWeight: "bold" }}>1. المقدمة:</Text> مرحبًا بكم
              في تطبيق فرقان. توضح سياسة الخصوصية هذه كيفية جمع المعلومات
              واستخدامها والكشف عنها وحمايتها عند استخدام تطبيق القرآن الصوتي
              الخاص بنا. يرجى قراءة هذه السياسة بعناية لفهم آرائنا وممارساتنا
              المتعلقة ببياناتك الشخصية وكيفية تعاملنا معها. باستخدام التطبيق،
              فإنك توافق على جمع المعلومات واستخدامها وفقًا لهذه السياسة. إذا
              كنت لا توافق على هذه السياسة، يرجى عدم استخدام التطبيق.
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <Text style={{textAlign:"right", fontWeight: "bold" }}>2. المعلومات التي نجمعها</Text>
            <Text>
              <Text style={{textAlign:"right", fontWeight: "bold", lineHeight: 23 }}>
                معلومات الجهاز:
              </Text>{" "}
              قد نقوم بجمع تفاصيل حول جهازك، بما في ذلك طرازه ونظام التشغيل
              ومعرفات الجهاز الفريدة ومعلومات الشبكة المحمولة.
            </Text>

            <Text style={{ marginTop: 10 }}>
              <Text style={{textAlign:"right", fontWeight: "bold", lineHeight: 23 }}>
                بيانات الاستخدام:
              </Text>{" "}
              معلومات حول كيفية تفاعلك مع التطبيق، مثل الصوتيات التي تستمع
              إليها، الميزات التي تستخدمها، والوقت الذي تقضيه في التطبيق.
            </Text>

            <Text style={{ marginTop: 10 }}>
              <Text style={{textAlign:"right", fontWeight: "bold", lineHeight: 23 }}>
                معلومات السجلات:
              </Text>{" "}
              سجلات تفاعلاتك مع التطبيق، بما في ذلك الأعطال والأخطاء وبيانات
              التشخيص.
            </Text>

            <View style={{ marginTop: 16 }}>
              <Text style={{textAlign:"right", fontWeight: "bold" }}>
                3. ملفات تعريف الارتباط والتقنيات المشابهة
              </Text>
              <Text style={{textAlign:"right", lineHeight: 23 }}>
                قد نستخدم ملفات تعريف الارتباط والتقنيات المشابهة لتحسين تجربة
                المستخدم الخاصة بك وتحليل كيفية استخدام التطبيق.
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
          <View>
            <Text style={styles.boldText}>Privacy & Policy</Text>
            <Text style={styles.boldText}>
              Effective Date:{" "}
              <Text style={{ fontWeight: "300", fontSize: 14 }}>
                February 02 2025
              </Text>{" "}
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <Text style={{ lineHeight: 23 }}>
              <Text style={{ fontWeight: "bold" }}>1.Introduction</Text>:
              Welcome to Furkan app. This privacy policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our Quran audio app. Please read this Policy carefully to
              understand our views and practices regarding your personal data
              and how we will treat it. By using the App, you agree to the
              collection and use of information in accordance with this Policy.
              If you do not agree with this Policy, please do not use the App.
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "bold" }}>2.Information We Collect</Text>
            <Text>
              <Text style={{ fontWeight: "bold", lineHeight: 23 }}>
                Device Information:
              </Text>{" "}
              We may collect details about your device, including its model,
              operating system, unique device identifiers, and mobile network
              information.
            </Text>

            <Text style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", lineHeight: 23 }}>
                Usage Data:
              </Text>
              Information about how you interact with the App, such as the audio
              you play, the features you use, and the time spent on the App
            </Text>

            <Text style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", lineHeight: 23 }}>
                Log Information:
              </Text>
              Logs of your interactions with the App, including crashes, errors,
              and diagnostic data.
            </Text>

            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: "bold" }}>
                3.Cookies and Similar Technologies
              </Text>
              <Text style={{ lineHeight: 23 }}>
                We may use cookies and similar technologies to enhance your user
                experience and analyze how the App is used.
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  boldText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: "bold",
  },
  boldTextAr: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: "bold",
    textAlign:"right"
  },
});
