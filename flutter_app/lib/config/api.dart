import 'package:flutter/foundation.dart';
import 'dart:io';

class ApiConfig {
  static String get baseUrl {
    if (kIsWeb) {
      return "http://localhost:3000/api";
    }

    if (Platform.isAndroid) {
      return "http://10.0.2.2:3000/api";
    }
    // Jika ingin menggunakan real device Android, ganti dengan IP lokal komputer Anda
    // return "http://<IP_Lokal_Komputer>:3000/api";
    return "http://192.168.1.12:3000/api"; 
  }
}
