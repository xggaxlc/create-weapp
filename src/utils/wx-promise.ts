function toPromise(wxApi, opt: any = {}, fn?) {
  return new Promise((resolve, reject) => {
    fn = fn || wx[wxApi];
    fn({
      ...opt,
      success: resolve,
      fail: reject
    });
  }) as Promise<any>;
}


export const wxPromise = {
  login: () => toPromise('login') as Promise<wx.LoginResult>,
  getSetting: () => toPromise('getSetting') as Promise<wx.IAuthSetting>,
  showModal: (opts: wx.ShowModalOptions) => toPromise('showModal', opts) as Promise<wx.ShowModalResult>,
  chooseImage: (opts: wx.ChooseImageOptions) => toPromise('chooseImage', opts) as Promise<wx.ChooseImageResult>,
  canvasToTempFilePath: (opts: wx.CanvasToTempFilePathOptions) => toPromise('canvasToTempFilePath', opts) as Promise<wx.CanvasToTempFilePathResult>,
  saveImageToPhotosAlbum: (opts: wx.saveImageToPhotosAlbumOptions) => toPromise('saveImageToPhotosAlbum', opts) as Promise<void>,
  request: (opts: wx.RequestOptions) => toPromise('request', opts) as Promise<wx.RequestResult>,
  upload: (opts: wx.UploadFileOptions) => toPromise('uploadFile', opts) as Promise<wx.UploadFileResult>,
  showActionSheet: (opts: wx.ShowActionSheetOptions) => toPromise('showActionSheet', opts) as Promise<wx.ShowActionSheetResult>,
  getSystemInfo: () => toPromise('getSystemInfo') as Promise<wx.GetSystemInfoResult>,
  getUserInfo: (opts?: wx.GetUserInfoOptions) => toPromise('getUserInfo', opts) as Promise<wx.GetUserInfoResult>,
  showToast: (opts?: wx.ShowToastOptions) => toPromise('showToast', opts) as Promise<void>,
  cloud: {
    callFunction: (opts?: wx.ICloudCallFunctionOpts) => toPromise('', opts, wx.cloud.callFunction) as Promise<wx.ICloudCallFunctionResult>,
  }
}
