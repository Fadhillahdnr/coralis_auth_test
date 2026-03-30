import 'package:flutter/foundation.dart';
import 'dart:io';

class ApiConfig {
  static String get baseUrl {
    if (kIsWeb) {
      return "http://localhost:3000/api";
    }

    // Untuk emulator Android
    if (!kIsWeb && Platform.isAndroid) {
      return const String.fromEnvironment(
        'API_URL',
        defaultValue: 'http://192.168.1.27:3000/api',
      );
    }

    return "http://192.168.1.27:3000/api";
  }
}