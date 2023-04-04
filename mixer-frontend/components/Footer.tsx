import {
  FaEnvelope,
  FaFacebookF,
  FaFax,
  FaGithub,
  FaGoogle,
  FaHome,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <footer className="text-black-600	 bg-lime-100 text-center lg:text-left ">
        <div className="border-black-300 flex items-center justify-center border-b p-6 lg:justify-between">
          <div className="mr-12 hidden lg:block">
            <span className="mr-8 flex justify-center text-xl font-bold">
              Connect with us on Social Networks
            </span>
          </div>
          <div className="mr-6 flex justify-center font-bold">
            <a href="#" className="text-black-600 mr-6">
              <FaFacebookF title="facebook" className="w-2.5" />
            </a>
            <a href="#" className="text-black-600 mr-6">
              <FaTwitter title="twitter" className="w-4" />
            </a>
            <a href="#" className="text-black-600 mr-6">
              <FaGoogle title="google" className="w-3.5" />
            </a>
            <a href="#" className="text-black-600 mr-6">
              <FaInstagram title="instagram" className="w-3.5" />
            </a>
            <a href="#" className="text-black-600 mr-6">
              <FaLinkedinIn title="linkedin" className="w-3.5" />
            </a>
            {/* <a href="#" className="text-black-600">
              <FaGithub title="github" className="w-4" />
            </a> */}
          </div>
        </div>

        <div className="mx-6 py-10 text-center md:text-left ">
          <img
            className="max-sm:mx-auto"
            src="https://evofinance.in/wp-content/uploads/2022/03/EvoFinance.png"
            alt=""
            width="150"
            height="50"
          />
          <div className="grid-1 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="">
              {/* <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                GrowPay
              </h6> */}
              {/* <p>
                Send or receive Crypto to friends on their phone number or email Ids.
              </p> */}
            </div>
            <div className="">
              <h6 className="mb-4 flex justify-center font-bold  text-lime-600 md:justify-start">
                About
              </h6>
              <p className="mb-4">
                <a href="/" className="text-black-600 font-bold ">
                  Community
                </a>
              </p>
              <p className="mb-4">
                <a href="/pay" className="text-black-600 font-bold ">
                  Documentation
                </a>
              </p>
              <p className="mb-4">
                <a href="/qrPay" className="text-black-600 font-bold ">
                  FAQ
                </a>
              </p>
              {/* <p>
                <a href="/myProfile" className="text-black-600">
                  My Profile
                </a>
              </p> */}
            </div>

            <div className="">
              <h6 className="mb-4 flex justify-center font-bold text-lime-600  md:justify-start">
                Help
              </h6>
              <p className="mb-4 flex items-center justify-center  font-bold md:justify-start">
                {/* <img
                  src="/icons/fas-home.svg"
                  alt="address"
                  className="mr-4 w-4 opacity-70"
                /> */}
                <FaHome title="address" className="mr-4 w-4 " /> IN
              </p>
              <p className="mb-4 flex items-center justify-center font-bold md:justify-start">
                <FaPhone title="phone" className="mr-4 w-4" /> +91 963 5021 539
              </p>
              <p className="mb-4 flex items-center justify-center font-bold md:justify-start">
                <FaEnvelope title="e-mail" className="mr-4 w-4" />{" "}
                test@something.com
              </p>

              {/* <p className="flex font-bold items-center justify-center md:justify-start">
                <FaFax title="fax" className=" mr-4 w-4" /> +91 963 5021 539
              </p> */}
            </div>
          </div>
        </div>

        <div className="bg-black p-6 text-center text-white">
          <span>© 2023 Copyright: </span>
          <a className="text-white	">A product from EvoFinance</a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
