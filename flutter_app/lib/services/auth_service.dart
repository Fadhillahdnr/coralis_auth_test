import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AuthService {
  static Future<bool> register(String email, String password) async {
    final response = await http.post(
      Uri.parse("${ApiConfig.baseUrl}/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "email": email,
        "password": password,
      }),
    );

    return response.statusCode == 200;
  }

  static Future<bool> login(String email, String password) async {
    try {
      print("LOGIN ke: ${ApiConfig.baseUrl}/login");

      final response = await http
          .post(
            Uri.parse("${ApiConfig.baseUrl}/login"),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode({
              "email": email,
              "password": password,
            }),
          )
          .timeout(const Duration(seconds: 10));

      print("Login response: ${response.statusCode}");
      return response.statusCode == 200;
    } catch (e) {
      print("Login error: $e");
      return false;
    }
  }

  static Future<bool> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse("${ApiConfig.baseUrl}/forgot-password"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email}),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  static Future<bool> verifyResetToken(String token) async {
    try {
      final response = await http.post(
        Uri.parse("${ApiConfig.baseUrl}/verify-reset-token"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"token": token}),
      );

      return response.statusCode == 200;
    } catch (e) {
      debugPrint("Verify token error: $e");
      return false;
    }
  }

  static Future<bool> resetPassword(String token, String newPassword) async {
    try {
      final response = await http.post(
        Uri.parse("${ApiConfig.baseUrl}/reset-password"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "token": token,
          "newPassword": newPassword,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      debugPrint("Reset password error: $e");
      return false;
    }
  }
}
