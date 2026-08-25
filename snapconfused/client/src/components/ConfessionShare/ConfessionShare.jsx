import { useRef, useState } from "react";

import {
    HiArrowDownTray,
    HiOutlineShare,
    HiXMark,
    HiCheck,
    HiLink,
} from "react-icons/hi2";

import { toPng } from "html-to-image";

import "./ConfessionShare.css";

import snapconfusedLogo from "../../assets/images/branding/snapconfused-logo.png";

import confusedGhost from "../../assets/images/share/ghost/snapconfused-ghost-confused.png";
import happyGhost from "../../assets/images/share/ghost/snapconfused-ghost-happy.png";
import laughingGhost from "../../assets/images/share/ghost/snapconfused-ghost-laughing.png";

import laughDoodle from "../../assets/images/share/doodles/snapconfused-doodle-laugh.png";
import cryDoodle from "../../assets/images/share/doodles/snapconfused-doodle-cry.png";
import eyesDoodle from "../../assets/images/share/doodles/snapconfused-doodle-eyes.png";
import questionDoodle from "../../assets/images/share/doodles/snapconfused-doodle-question.png";
import flameDoodle from "../../assets/images/share/doodles/snapconfused-doodle-flame.png";
import starsDoodle from "../../assets/images/share/doodles/snapconfused-doodle-stars.png";
import heartDoodle from "../../assets/images/share/doodles/snapconfused-doodle-heart.png";
import scribbleDoodle from "../../assets/images/share/doodles/snapconfused-doodle-scribble.png";


const ghostOptions = [
    confusedGhost,
    happyGhost,
    laughingGhost,
];


const doodleOptions = [
    laughDoodle,
    cryDoodle,
    eyesDoodle,
    questionDoodle,
    flameDoodle,
    starsDoodle,
    heartDoodle,
    scribbleDoodle,
];


const getRandomItem = (items) => {
    return items[
        Math.floor(Math.random() * items.length)
    ];
};


const getConfessionNumber = (confession, index) => {
    if (confession?.number) {
        return String(confession.number).padStart(3, "0");
    }

    if (index !== undefined && index !== null) {
        return String(index + 1).padStart(3, "0");
    }

    return "001";
};


const ConfessionShare = ({
    confession,
    index = 0,
    onClose,
}) => {

    const cardRef = useRef(null);

    const [sharing, setSharing] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareError, setShareError] = useState("");


    const [ghost] = useState(
        () => getRandomItem(ghostOptions)
    );

    const [doodleOne] = useState(
        () => getRandomItem(doodleOptions)
    );

    const [doodleTwo] = useState(
        () => getRandomItem(doodleOptions)
    );


    if (!confession) {
        return null;
    }


    const confessionText =
        confession.content || "No confession available.";


    const author =
        confession.isAnonymous
            ? "Anonymous"
            : confession.author || "Anonymous";


    const confessionNumber =
        getConfessionNumber(
            confession,
            index
        );


    const fileName =
        `snapconfused-confession-${confessionNumber}.png`;


    const generateImage = async () => {

        if (!cardRef.current) {
            throw new Error(
                "Confession card is not ready."
            );
        }


        return await toPng(
            cardRef.current,
            {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#fffdf5",
            }
        );
    };


    const dataUrlToFile = async (
        dataUrl
    ) => {

        const response =
            await fetch(dataUrl);

        const blob =
            await response.blob();

        return new File(
            [blob],
            fileName,
            {
                type: "image/png",
            }
        );
    };


    const handleDownload = async () => {

        try {

            setDownloading(true);
            setShareError("");

            const dataUrl =
                await generateImage();


            const link =
                document.createElement("a");

            link.download =
                fileName;

            link.href =
                dataUrl;

            link.click();

        } catch (error) {

            console.error(
                "Confession image download failed:",
                error
            );

            setShareError(
                "We couldn't create the image. Try again."
            );

        } finally {

            setDownloading(false);

        }

    };


    const handleShare = async () => {

        try {

            setSharing(true);
            setShareError("");

            const dataUrl =
                await generateImage();

            const file =
                await dataUrlToFile(
                    dataUrl
                );


            const shareText =
                `😭 ${confessionText}\n\n` +
                `— ${author}\n\n` +
                `Confess. Laugh. Relate.\n` +
                `https://snapconfused.vercel.app`;


            if (
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({
                    files: [file],
                })
            ) {

                await navigator.share({
                    title: "SnapConfused",
                    text: shareText,
                    files: [file],
                });

                return;
            }


            if (
                navigator.share
            ) {

                await navigator.share({
                    title: "SnapConfused",
                    text: shareText,
                    url: "https://snapconfused.vercel.app",
                });

                return;
            }


            await navigator.clipboard.writeText(
                shareText
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2500);

        } catch (error) {

            if (
                error?.name ===
                "AbortError"
            ) {
                return;
            }


            console.error(
                "Confession sharing failed:",
                error
            );

            setShareError(
                "We couldn't share this confession."
            );

        } finally {

            setSharing(false);

        }

    };


    const handleCopyLink = async () => {

        try {

            await navigator.clipboard.writeText(
                "https://snapconfused.vercel.app"
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2500);

        } catch (error) {

            console.error(
                "Failed to copy link:",
                error
            );

        }

    };


    return (

        <div
            className="confession-share-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose?.();
                }

            }}
        >

            <div
                className="confession-share-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Share confession"
            >

                {/* HEADER */}

                <div className="confession-share-header">

                    <div>

                        <span>
                            SHARE THIS ONE
                        </span>

                        <h2>
                            Make it a post.
                        </h2>

                    </div>


                    <button
                        type="button"
                        className="confession-share-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <HiXMark />
                    </button>

                </div>


                {/* IMAGE */}

                <div className="confession-share-preview">

                    <div
                        ref={cardRef}
                        className="confession-share-card"
                    >

                        <img
                            src={snapconfusedLogo}
                            alt=""
                            className="share-card-logo"
                        />


                        <div className="share-card-number">
                            #{confessionNumber}
                        </div>


                        <img
                            src={doodleOne}
                            alt=""
                            aria-hidden="true"
                            className="share-card-doodle share-card-doodle-one"
                        />


                        <img
                            src={doodleTwo}
                            alt=""
                            aria-hidden="true"
                            className="share-card-doodle share-card-doodle-two"
                        />


                        <div className="share-card-content">

                            <span className="share-card-label">
                                CONFESSION
                            </span>


                            <p className="share-card-quote">
                                “{confessionText}”
                            </p>


                            <div className="share-card-author">

                                <span className="share-card-author-line" />

                                <span>
                                    — {author}
                                </span>

                            </div>

                        </div>


                        <img
                            src={ghost}
                            alt=""
                            aria-hidden="true"
                            className="share-card-ghost"
                        />


                        <div className="share-card-footer">

                            <strong>
                                CONFESS. LAUGH. RELATE.
                            </strong>

                            <span>
                                snapconfused.vercel.app
                            </span>

                        </div>

                    </div>

                </div>


                {/* ERROR */}

                {shareError && (

                    <p className="confession-share-error">
                        {shareError}
                    </p>

                )}


                {/* ACTIONS */}

                <div className="confession-share-actions">

                    <button
                        type="button"
                        className="share-action-primary"
                        onClick={handleShare}
                        disabled={sharing}
                    >

                        {sharing ? (
                            <>
                                <span className="share-spinner" />
                                Creating image...
                            </>
                        ) : (
                            <>
                                <HiOutlineShare />
                                Share image
                            </>
                        )}

                    </button>


                    <button
                        type="button"
                        className="share-action-secondary"
                        onClick={handleDownload}
                        disabled={downloading}
                    >

                        {downloading ? (
                            <>
                                <span className="share-spinner" />
                                Preparing...
                            </>
                        ) : (
                            <>
                                <HiArrowDownTray />
                                Download
                            </>
                        )}

                    </button>


                    <button
                        type="button"
                        className="share-action-link"
                        onClick={handleCopyLink}
                    >

                        {copied ? (
                            <>
                                <HiCheck />
                                Copied
                            </>
                        ) : (
                            <>
                                <HiLink />
                                Copy link
                            </>
                        )}

                    </button>

                </div>


                <p className="confession-share-note">
                    Share the image directly to WhatsApp,
                    Instagram or anywhere your friends hang out.
                </p>

            </div>

        </div>

    );

};


export default ConfessionShare;