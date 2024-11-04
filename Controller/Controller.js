import Tesseract from "tesseract.js";

const extractDetails = (text) => {
    console.log("OCR Text:", text);

    // Updated patterns for better flexibility and handling OCR variations
    const nameMatch = text.match(/(?:SGaEmmenONIngEs|Swafuvan|Name)\s*([A-Za-z]+(?: [A-Za-z]+)*)/i); 
    const dobMatch = text.match(/(?:DOB|Date of Birth|D\.O\.B\.)\s*[:\-]?\s*([0-3]?\d[\/\-][01]?\d[\/\-]\d{2,4})/i);
    const guardianMatch = text.match(/S\/O:\s*([A-Za-z ]+)/i); 
    const addressMatch = text.match(/S\/O:\s*[^\n]*\n([\s\S]*?)(?=Sub District|District|State|PIN|Pincode|PIN Code)/i); 
    const subDistrictMatch = text.match(/Sub District:\s*([A-Za-z ]+)/i); 
    const districtMatch = text.match(/ District:\s*([A-Za-z ]+)/i); 
    const stateMatch = text.match(/State:\s*([A-Za-z ]+)/i); 
    const pincodeMatch = text.match(/\b\d{6}\b/);  
    const mobileMatch = text.match(/Mobile:\s*(\d{10})/); 
    const uidMatch = text.match(/\b\d{4}\s*\d{4}\s*\d{4}\b/); 

    // Clean and format address
    let cleanAddress = "N/A";
    if (addressMatch) {
        const rawAddress = addressMatch[1];
        const places = rawAddress
            .replace(/(?:VTC|PO|House|purath|A V House|CHL E TU)\s*:\s*|,/gi,"")
            .split(/\n+/) // Split by new lines
            .map((part) => part.trim())
            .filter((part) => part && !/^\d/.test(part)); // Filter out empty and numeric-only lines
        cleanAddress = places.join(", ");
    }

    return {
        Name: nameMatch ? nameMatch[0].trim() : "N/A",
        DOB: dobMatch ? dobMatch[1].trim() : "N/A",
        Guardian: guardianMatch ? guardianMatch[1].trim() : "N/A",
        Address: cleanAddress,
        SubDistrict: subDistrictMatch ? subDistrictMatch[1].trim() : "N/A",
        District: districtMatch ? districtMatch[1].trim() : "N/A",
        State: stateMatch ? stateMatch[1].trim() : "N/A",
        Pincode: pincodeMatch ? pincodeMatch[0].trim() : "N/A",
        Mobile: mobileMatch ? mobileMatch[1].trim() : "N/A",
        UID: uidMatch ? uidMatch[0].replace(/\s/g, "").trim() : "N/A",
    };
};


export const AdhaarDetails = async (req, res) => {
    try {
        const frontFile = req.files['front'] ? req.files['front'][0] : null;
        const backFile = req.files['back'] ? req.files['back'][0] : null;

        if (!frontFile || !backFile) {
            return res.status(400).json({ message: 'Both front and back documents are required' });
        }

        const frontTextResult = await Tesseract.recognize(frontFile.buffer, 'eng');
        const frontText = frontTextResult.data.text;
        const backTextResult = await Tesseract.recognize(backFile.buffer, 'eng');
        const backText = backTextResult.data.text;
        
        const frontDetails = extractDetails(frontText);
        const backDetails = extractDetails(backText);
        const combinedDetails = { ...backDetails, ...frontDetails };
        console.log(combinedDetails)
        return res.status(200).json({
            message: 'OCR processing completed successfully!',
            details: combinedDetails,
        });
    } catch (error) {
        console.error("Error during OCR processing:", error);
        res.status(500).json({ message: 'OCR processing failed' });
    }
};
