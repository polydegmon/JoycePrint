﻿using System.Diagnostics.CodeAnalysis;
using JoycePrint.Web.Tests.TestData;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;

namespace JoycePrint.Web.Tests.PageObjectModels
{
    [SuppressMessage("ReSharper", "UnusedAutoPropertyAccessor.Global")]
    public class AboutUsPom : BasePom
    {
        /// <summary>
        /// The object containing all the test data required for the about us page
        /// </summary>
        public AboutUsTestData AboutUsTestData { get; set; }

        #region Selenium Properties

        /// <summary>
        /// The by form element for the page
        /// </summary>
        public static string ByForm => "[data-test-form-id='frmAboutUs']";

        /// <summary>
        /// The form element for the page
        /// </summary>
        [FindsBy(How = How.CssSelector, Using = "[data-test-form-id='frmAboutUs']")]
        public IWebElement Form { get; set; }

        /// <summary>
        /// The company history image element for the page
        /// </summary>
        [FindsBy(How = How.CssSelector, Using = "[data-test-company-history]")]
        public IWebElement CompanyHistory { get; set; }

        /// <summary>
        /// The company history image element for the page
        /// </summary>
        [FindsBy(How = How.CssSelector, Using = "[data-test-history-img]")]
        public IWebElement CompanyHistoryImage { get; set; }
        public static string ByCompanyHistoryImage => "[data-test-history-img]";

        /// <summary>
        /// The address text element for the page
        /// </summary>
        [FindsBy(How = How.CssSelector, Using = "[data-test-address-text]")]
        public IWebElement AddressText { get; set; }

        /// <summary>
        /// The phone text element for the page
        /// </summary>
        [FindsBy(How = How.CssSelector, Using = "[data-test-phone-text]")]
        public IWebElement PhoneText { get; set; }

        /// <summary>
        /// The email text element for the page
        /// </summary>
        [FindsBy(How = How.CssSelector, Using = "[data-test-email-text]")]
        public IWebElement EmailText { get; set; }

        /// <summary>
        /// The mobile text element for the page
        /// </summary>
        [FindsBy(How = How.CssSelector, Using = "[data-test-mobile-text]")]
        public IWebElement MobileText { get; set; }

        /// <summary>
        /// The map element for the page
        /// </summary>
        [FindsBy(How = How.CssSelector, Using = "[data-test-map]")]
        public IWebElement Map { get; set; }
        public static string ByMap => "[data-test-map]";

        #endregion

        public AboutUsPom(IWebDriver driver) : base(driver, By.CssSelector(ByForm))
        {
            AboutUsTestData = new AboutUsTestData();
        }
    }
}