import S3 from 'aws-sdk/clients/s3.js'; 
import { useState } from "react";
import './upload-image.scss';

const UploadImage = ({props, imageUploaded}) => {

    const [file, setFile] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageLoadedSuccess, setImageLoadedSuccess] = useState(false);
    const [pogressBar, setPogressBar] = useState(false);

    // S3 Bucket Name
    const S3_BUCKET = import.meta.env.S3_BUCKET;

    // S3 Region
    const REGION = import.meta.env.S3_REGION;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        uploadFile(file);
    };

    const uploadFile = async (file) => {

        // S3 Credentials
        const s3 = new S3({
            params: { Bucket: S3_BUCKET },
            region: REGION,
            accessKeyId: import.meta.env.S3_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.S3_SECRET_ACCESS_KEY
        });

        // Files Parameters

        const params = {
            Bucket: S3_BUCKET,
            Key: file.name,
            Body: file,
        };

        // Uploading file to s3
        setImageLoading(true);
        var upload = s3
            .putObject(params)
            .on("httpUploadProgress", (evt) => {
            // File uploading progress
            console.log(
              "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
            );

            setPogressBar(parseInt((evt.loaded * 100) / evt.total))
        })
        .promise();

        await upload.then((err, data) => {
            console.log(err);
            console.log(data);

            imageUploaded(file.name);

            setImageLoading(false);
            setImageLoadedSuccess(true);

            setTimeout(() => {
                setImageLoadedSuccess(false);
            }, 5000);
        });
    }

    return (
        <div className="App">
        <div>
            <input className='form-control' type="file" onChange={handleFileChange} />
            {
                imageLoadedSuccess && <div>Imagen cargada exitosamente</div>
            }
            {
                imageLoading && (
                    <div className="progress">
                        <div className={`progress-bar bg-info w–${pogressBar}`} style={{ width: pogressBar + '%'}} role="pogressBar" aria-valuenow={pogressBar} aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                )
            }
            
        </div>
        </div>
    );
}

export default UploadImage;