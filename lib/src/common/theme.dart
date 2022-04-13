import 'package:basearch/src/common/theme_dark.dart';
import 'package:basearch/src/common/theme_light.dart';
import 'package:flutter/material.dart';

class AppTheme extends ChangeNotifier {
  late bool useSystem;

  void setUseSystem(bool shouldUse) {
    useSystem = shouldUse;
    notifyListeners();
  }

  ThemeData getLightTheme() {
    if (useSystem) {
      return lightTheme;
    } else {
      return darkTheme;
    }
  }

  ThemeData getDarkTheme() {
    if (useSystem) {
      return darkTheme;
    } else {
      return lightTheme;
    }
  }
}
