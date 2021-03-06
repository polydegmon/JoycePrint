﻿using System;
using System.Collections.Specialized;
using Common.Logging.Enums;

namespace Common.Logging
{
    public abstract class LogProvider : Providers.ProviderBase
    {
        // ReSharper disable once RedundantOverriddenMember
        public override void Initialize(string providerName, NameValueCollection providerConfig)
        {
            base.Initialize(providerName, providerConfig);
        }

        public abstract void Log(MessageLevel messageLevel, string message);

        public abstract void Log(MessageLevel messageLevel, Exception message);

        public abstract void Log(MessageLevel messageLevel, Exception message, string additionalMessage);
    }
}