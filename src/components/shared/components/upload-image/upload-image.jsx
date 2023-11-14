import { useState } from "react";

function UploadImage() {

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const uploadFile = async () => {
        // S3 Bucket Name
        const S3_BUCKET = "bucket-name";

        // S3 Region
        const REGION = "region";

        // S3 Credentials
        AWS.config.update({
            accessKeyId: "youraccesskeyhere",
            secretAccessKey: "yoursecretaccesskeyhere",
        });
        const s3 = new AWS.S3({
            params: { Bucket: S3_BUCKET },
            region: REGION,
        });

        // Files Parameters

        const params = {
            Bucket: S3_BUCKET,
            Key: file.name,
            Body: file,
        };

        // Uploading file to s3
        var upload = s3
            .putObject(params)
            .on("httpUploadProgress", (evt) => {
            // File uploading progress
            console.log(
              "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
            );
        })
        .promise();

        await upload.then((err, data) => {
            console.log(err);
            // Fille successfully uploaded
            alert("File uploaded successfully.");
        });
    }

    return (
        <div className="App">
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
        </div>
        </div>
    );
}

export default UploadImage;