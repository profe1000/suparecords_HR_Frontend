import { Image } from "antd";
import { RoomType } from "./roomType.types";
import { appZIndex } from "../../../utils/appconst";

type Props = {
  roomType: RoomType;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export default function RoomTypeDetailsModal({ roomType }: Props) {
  const priceFields: Array<[string, string]> = [
    ["Base price", roomType.base_price],
    ["Discounted price", roomType.discounted_price],
    ["Website price", roomType.website_price],
    ["Corporate price", roomType.cooperate_price],
  ];
  const galleryImages = [...(roomType.images || [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className={`overflow-hidden rounded-xl border border-slate-200 ${
            roomType.feature_video_url ? "" : "sm:col-span-2"
          }`}
        >
          {roomType.feature_image ? (
            <img
              src={roomType.feature_image}
              alt={roomType.name}
              className="h-56 w-full object-cover"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
              No feature image
            </div>
          )}
        </div>
        {roomType.feature_video_url && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {roomType.feature_video_url.includes("youtube.com") ||
            roomType.feature_video_url.includes("youtu.be") ? (
              <iframe
                className="h-56 w-full"
                src={roomType.feature_video_url
                  .replace("watch?v=", "embed/")
                  .replace("youtu.be/", "www.youtube.com/embed/")}
                title="Feature video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : roomType.feature_video_url.includes("vimeo.com") ? (
              <iframe
                className="h-56 w-full"
                src={roomType.feature_video_url.replace(
                  "vimeo.com/",
                  "player.vimeo.com/video/",
                )}
                title="Feature video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <a
                href={roomType.feature_video_url}
                target="_blank"
                rel="noreferrer"
                className="flex h-56 items-center justify-center px-4 py-3 text-sm font-medium text-red-800 underline"
              >
                Open feature video
              </a>
            )}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{roomType.name}</h3>
        {roomType.description && (
          <p className="mt-1 text-sm text-slate-500">{roomType.description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {priceFields.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {currency(Number(value))}
            </dd>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Max adults</dt>
          <dd className="mt-1 text-sm font-medium text-slate-900">
            {roomType.max_adults}
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Max children</dt>
          <dd className="mt-1 text-sm font-medium text-slate-900">
            {roomType.max_children}
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Room size</dt>
          <dd className="mt-1 text-sm font-medium text-slate-900">
            {roomType.room_size}
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Bed type</dt>
          <dd className="mt-1 text-sm font-medium text-slate-900">
            {roomType.bed_type} ({roomType.total_beds})
          </dd>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-700">
          Gallery images
        </h4>
        {galleryImages.length === 0 ? (
          <p className="text-sm text-slate-500">No gallery images added.</p>
        ) : (
          <Image.PreviewGroup preview={{ zIndex: appZIndex.tooltips }}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {galleryImages.map((image, index) => (
                <Image
                  key={`${image.image_url}-${index}`}
                  src={image.image_url}
                  alt={`${roomType.name} ${index + 1}`}
                  className="h-24 w-full rounded-lg object-cover"
                  wrapperClassName="h-24 w-full cursor-pointer"
                />
              ))}
            </div>
          </Image.PreviewGroup>
        )}
      </div>
    </div>
  );
}
