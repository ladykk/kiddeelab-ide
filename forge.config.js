module.exports = {
  packagerConfig: {
    icon: "src/assets/icon/icon",
    arch: ["x64", "arm64"],
    appBundleId: "th.co.kiddeelab.ide",
    platform: ["darwin", "win32"],
    appCategoryType: "public.app-category.education",
    darwinDarkModeSupport: false,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "th.co.kiddeelab.ide",
        title: "KiddeeLab IDE",
        iconUrl:
          "https://firebasestorage.googleapis.com/v0/b/kiddeelab.appspot.com/o/icon.ico?alt=media&token=0fd158d8-f318-4d6f-a4b6-1e58000db438",
        setupIcon: "src/assets/icon/icon.ico",
      },
    },
    // {
    //   name: "@electron-forge/maker-dmg",
    //   config: {
    //     format: "ULFO",
    //     icon: "src/assets/icon/icon.icns",
    //   },
    // },
    // {
    //   name: "@electron-forge/maker-zip",
    // },
  ],
};
