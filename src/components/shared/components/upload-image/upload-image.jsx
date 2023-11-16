import React, {useState} from 'react';
import './upload-image.scss';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const UploadImage = ({props, imageUploaded}) => {

    const [file, setFile] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageLoadedSuccess, setImageLoadedSuccess] = useState(false);
    const [pogressBar, setPogressBar] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        uploadFile(file);
    };

    const uploadFile = async (file) => {
        console.log('file ', file);
        // S3 Credentials
        const client = new S3Client({
            region: import.meta.env.VITE_S3_REGION,
            credentials: {
                accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
                secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
            },
        });

        setImageLoading(true);
        await client.send(new PutObjectCommand({
            Bucket: import.meta.env.VITE_S3_BUCKET,
            Key: file.name,
            Body: file
        }));

        setImageLoadedSuccess(true);
        imageUploaded(file.name);
        setImageLoading(false);

        setTimeout(() => {
            setImageLoadedSuccess(false);
        }, 5000);

        console.log('todo ok');
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