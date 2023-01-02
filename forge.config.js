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
        setupIcon: "src/assets/icon/icon.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
    },
  ],
};
