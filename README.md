# Zalo ChatBot Project Share By NDQ

# Using Nodejs 20

This Zalo ChatBot project is developed using JavaScript with the **zlbotdqt** library. The creator of this project is **SBT**. You can find more information at [SBT](https://github.com/itisme).

## Version Features ( v1.5.3 )

The following features are available in this version:

- **Auto Manager Group Zalo**: With more than 50 command manager:
  - Auto anti-spam / anti-link / anti-badword / antinude...
- **Social Bot**: With more than 50 commands to send entertainment content from youtube, tiktok, zingmp3, nhaccuatui,.... and more.

## Usage Instructions

1. **Configuration**: Configure the bot in the `config.json` file located in the `assets` folder. Here’s what you need to set up:

   - **Cookies**: Use the **J2TEAM Cookies** extension to obtain your cookies. You can find the extension [here](https://chrome.google.com/webstore/detail/j2team-cookies/okpidcojinmlaakglciglbpcpajaibco).
   - **IMEI**: Access Zalo Web, then open the Developer Tools (DevTools), switch to the Console tab, and enter the following command:
     ```javascript
     localStorage.getItem("z_uuid");
     ```
   - **UserAgent**: You can either leave the default UserAgent or replace it with your own. Visit [whatmyuseragent.com](https://whatmyuseragent.com/) to check your UserAgent.

2. **Running the Bot**: After configuring the necessary settings, run the `run.bat` file to start the bot.

3. **Setting Admin Rights**: You can view the UID of the account you want to grant admin rights to via the console. Add the UID to the `list_admin.json` file in the `assets/data` folder.

4. **Restart the Tool**: Make sure to restart the tool after configuring to ensure everything works correctly.

## Hướng dẫn chạy bot trên Termux (Android)

### 1. Cài đặt môi trường

```sh
pkg update && pkg upgrade
pkg install nodejs
pkg install git
pkg install build-essential python
```

### 2. Clone source code (nếu chưa có)

```sh
git clone <link-repo>
cd Bot
```

### 3. Cài đặt và chạy bot

```sh
chmod +x run.sh
./run.sh
```

### 4. Lưu ý

- Nếu gặp lỗi liên quan đến package native (như canvas, sqlite3, ...), hãy đảm bảo đã cài đủ build-essential và python.
- Đảm bảo các thư mục `logs/`, `assets/temp/` tồn tại và có quyền ghi.
- Để dừng bot: nhấn `Ctrl+C` trong Termux.

Thank you for using our source code. We hope you enjoy the features it offers!
