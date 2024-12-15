"use client"

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { convertFileToUrl } from '@/lib/utils'

type FileUploaderProps = {
    files: File[] | undefined,
    onChange: (files: File[]) => void,
}

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onChange(acceptedFiles)
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {files && files?.length > 0 ? (
                <Image src={convertFileToUrl(files[0])} alt='uploaded img' width={1000} height={1000} className='max-h-[400px] overflow-hidden object-cover'></Image>
            ) : (
                <>
                    <Image src="/assets/icons/upload.svg" width={40} height={40} alt='upload'></Image>
                    <div className="file-upload_label">
                        <p className="text-14-regular">
                            <span className="text-green-500">
                                Click to upload
                            </span> or drag and <data value=""></data>rop
                        </p>
                        <p>
                            SVG, PNG, JPG or Gif (max 800x400)
                        </p>
                    </div>
                </>
            )}
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    null
            }
        </div>
    )
}
export default FileUploader