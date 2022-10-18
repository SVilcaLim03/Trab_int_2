// campos de estado y botón de inicio en la interfaz de usuario
var phraseDiv;
var startRecognizeOnceAsyncButton;
var filePicker, audioFile;

// clave de subscripcion
var subscriptionKey, serviceRegion;
var SpeechSDK;
var recognizer;

document.addEventListener("DOMContentLoaded", function () {
  startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
  subscriptionKey.value = 'e057fc4513e24fa5b954e8796591073d';
  serviceRegion.value = 'eastus';
  phraseDiv = document.getElementById("phraseDiv");
  filePicker = document.getElementById("filePicker");
  filePicker.addEventListener("change", function () {
      audioFile = filePicker.files[0];
      startRecognizeOnceAsyncButton.disabled = false;
  });

  startRecognizeOnceAsyncButton.addEventListener("click", function () {
    startRecognizeOnceAsyncButton.disabled = true;
    phraseDiv.innerHTML = "";

    if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
      alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
      return;
    }
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);

    speechConfig.speechRecognitionLanguage = "en-US";
    var audioConfig  = SpeechSDK.AudioConfig.fromWavFileInput(audioFile);
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
      function (result) {
        startRecognizeOnceAsyncButton.disabled = false;
        phraseDiv.innerHTML += result.text;
        window.console.log(result);

        recognizer.close();
        recognizer = undefined;
      },
      function (err) {
        startRecognizeOnceAsyncButton.disabled = false;
        phraseDiv.innerHTML += err;
        window.console.log(err);

        recognizer.close();
        recognizer = undefined;
      });
  });

  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    startRecognizeOnceAsyncButton.disabled = false;

    document.getElementById('content').style.display = 'block';
    document.getElementById('warning').style.display = 'none';
  }
});