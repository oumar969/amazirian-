class AppConfig {
  /// Base URL for the backend API.
  ///
  /// Examples:
  /// - Android emulator (host machine): http://10.0.2.2:3001/api
  /// - iOS simulator (host machine):   http://localhost:3001/api
  /// - Real device on same Wi‑Fi:      http://YOUR_LAN_IP:3001/api
  static const String apiBase = String.fromEnvironment(
    'API_BASE',
    defaultValue: 'http://10.0.2.2:3001/api',
  );

  /// Optional: base URL for the web app.
  static const String webBase = String.fromEnvironment(
    'WEB_BASE',
    defaultValue: 'http://10.0.2.2:5173',
  );
}
