import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:provider/provider.dart';

import 'app_module.dart';
import 'app_widget.dart';
import 'common/theme.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AppTheme()),
      ],
      child: ModularApp(module: AppModule(), child: const AppWidget()),
    ),
  );
}
