import React from "react";

const Challan = ({ formData, courseFee }) => {
  const getCurrentDate = () => {
    const date = new Date();
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  const generateVoucherNo = () => {
    return `ICR${new Date().getFullYear()}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  };

  const voucherNo = generateVoucherNo();

  const getAmountInWords = (amount) => {
    const words = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
      "Twenty",
    ];
    const tens = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (amount === 0) return "Zero Only";

    let result = "";
    if (amount >= 1000) {
      result += words[Math.floor(amount / 1000)] + " Thousand ";
      amount %= 1000;
    }
    if (amount >= 100) {
      result += words[Math.floor(amount / 100)] + " Hundred ";
      amount %= 100;
    }
    if (amount > 0) {
      if (amount < 20) {
        result += words[amount];
      } else {
        result += tens[Math.floor(amount / 10)];
        if (amount % 10 > 0) {
          result += " " + words[amount % 10];
        }
      }
    }
    return result + " Only";
  };

  const registrationFee = 0;
  const totalAmount = courseFee + registrationFee;

  return (
    <div className="container my-4 p-4 bg-white shadow rounded">
      {/* Header */}
      <div className="text-center border-bottom pb-3 mb-4">
        <h1 className="fw-bold text-dark">IT Center Rahim Yar Khan</h1>
        <p className="text-muted">Rahim Yar Khan, Punjab, Pakistan</p>
        <span className="badge bg-secondary fs-5">FEE PAYMENT CHALLAN</span>
      </div>

      {/* Copies Section */}
      <div className="row g-4">
        {/* Bank Copy */}
        <div className="col-md-4">
          <div className="card border shadow-sm h-100">
            <div className="card-header text-center bg-warning bg-opacity-25">
              <span className="badge bg-warning text-dark">Bank Copy</span>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-5 fw-bold">Date:</div>
                <div className="col-7">{getCurrentDate()}</div>
                <div className="col-5 fw-bold">Voucher No:</div>
                <div className="col-7">{voucherNo}</div>
                <div className="col-5 fw-bold">Program:</div>
                <div className="col-7">{formData.courseDetails.courseName}</div>
                <div className="col-5 fw-bold">Student:</div>
                <div className="col-7">{formData.personalDetails.studentName}</div>
                <div className="col-5 fw-bold">Father's Name:</div>
                <div className="col-7">{formData.personalDetails.fatherName}</div>
                <div className="col-5 fw-bold">Due Date:</div>
                <div className="col-7">15 days from issuance</div>
              </div>
              <table className="table table-bordered table-sm text-center">
                <thead className="table-light">
                  <tr>
                    <th>S#</th>
                    <th>Description</th>
                    <th>Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Course Fee</td>
                    <td>{courseFee.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Registration Fee</td>
                    <td>{registrationFee.toLocaleString()}</td>
                  </tr>
                  <tr className="fw-bold table-light">
                    <td colSpan="2">Total Payable</td>
                    <td>{totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div className="alert alert-secondary py-2">
                <strong>Amount in Words: </strong> {getAmountInWords(totalAmount)}
              </div>
              <div className="alert alert-warning small">
                <strong>Note:</strong> This challan is valid only if deposited in
                authorized banks.
              </div>
            </div>
          </div>
        </div>

        {/* Student Copy */}
        <div className="col-md-4">
          <div className="card border shadow-sm h-100">
            <div className="card-header text-center bg-info bg-opacity-25">
              <span className="badge bg-info text-dark">Student Copy</span>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-5 fw-bold">Date:</div>
                <div className="col-7">{getCurrentDate()}</div>
                <div className="col-5 fw-bold">Voucher No:</div>
                <div className="col-7">{voucherNo}</div>
                <div className="col-5 fw-bold">Program:</div>
                <div className="col-7">{formData.courseDetails.courseName}</div>
                <div className="col-5 fw-bold">Student:</div>
                <div className="col-7">{formData.personalDetails.studentName}</div>
                <div className="col-5 fw-bold">Father's Name:</div>
                <div className="col-7">{formData.personalDetails.fatherName}</div>
                <div className="col-5 fw-bold">Due Date:</div>
                <div className="col-7">15 days from issuance</div>
              </div>
              <table className="table table-bordered table-sm text-center">
                <thead className="table-light">
                  <tr>
                    <th>S#</th>
                    <th>Description</th>
                    <th>Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Course Fee</td>
                    <td>{courseFee.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Registration Fee</td>
                    <td>{registrationFee.toLocaleString()}</td>
                  </tr>
                  <tr className="fw-bold table-light">
                    <td colSpan="2">Total Payable</td>
                    <td>{totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div className="alert alert-secondary py-2">
                <strong>Amount in Words: </strong> {getAmountInWords(totalAmount)}
              </div>
              <div className="alert alert-info small">
                <strong>Note:</strong> Keep this copy for your record.
              </div>
            </div>
          </div>
        </div>

        {/* Institute Copy */}
        <div className="col-md-4">
          <div className="card border shadow-sm h-100">
            <div className="card-header text-center bg-success bg-opacity-25">
              <span className="badge bg-success text-dark">Institute Copy</span>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-5 fw-bold">Date:</div>
                <div className="col-7">{getCurrentDate()}</div>
                <div className="col-5 fw-bold">Voucher No:</div>
                <div className="col-7">{voucherNo}</div>
                <div className="col-5 fw-bold">Program:</div>
                <div className="col-7">{formData.courseDetails.courseName}</div>
                <div className="col-5 fw-bold">Student:</div>
                <div className="col-7">{formData.personalDetails.studentName}</div>
                <div className="col-5 fw-bold">Father's Name:</div>
                <div className="col-7">{formData.personalDetails.fatherName}</div>
                <div className="col-5 fw-bold">Due Date:</div>
                <div className="col-7">15 days from issuance</div>
              </div>
              <table className="table table-bordered table-sm text-center">
                <thead className="table-light">
                  <tr>
                    <th>S#</th>
                    <th>Description</th>
                    <th>Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Course Fee</td>
                    <td>{courseFee.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Registration Fee</td>
                    <td>{registrationFee.toLocaleString()}</td>
                  </tr>
                  <tr className="fw-bold table-light">
                    <td colSpan="2">Total Payable</td>
                    <td>{totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div className="alert alert-secondary py-2">
                <strong>Amount in Words: </strong> {getAmountInWords(totalAmount)}
              </div>
              <div className="alert alert-success small">
                <strong>Note:</strong> Submit this copy to the Accounts
                Department.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-top mt-4 pt-3 text-muted small">
        Generated on: {getCurrentDate()} | For inquiries contact:
        accounts@icr.edu.pk
      </div>
    </div>
  );
};

export default Challan;
