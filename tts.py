"""
pip install TTS
pip install transformers==4.37.2
https://github.com/coqui-ai/TTS
https://github.com/nipponjo/tts_arabic/tree/main
https://github.com/nipponjo/tts-arabic-pytorch
"""

import torch
from TTS.api import TTS
from TTS.config.shared_configs import BaseDatasetConfig
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsArgs, XttsAudioConfig

# Allow necessary config classes for unpickling
torch.serialization.add_safe_globals(
    [XttsConfig, XttsAudioConfig, BaseDatasetConfig, XttsArgs]
)

# Load model
model_name = "tts_models/multilingual/multi-dataset/xtts_v2"
tts = TTS(model_name)
text = "مسمار"

# Generate Arabic speech using your voice sample
tts.tts_to_file(
    text=text,
    speaker_wav="arabic_voice.wav",
    language="ar",
    file_path=f"./pronunciation_api/media/{text}.wav",
)
