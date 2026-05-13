import { Link } from "react-router-dom";
import type { FoodPost } from "../types";

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  requested: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  picked_up: "bg-purple-100 text-purple-700",
  delivered: "bg-gray-100 text-gray-600",
  expired: "bg-red-100 text-red-600",
  cancelled: "bg-gray-100 text-gray-500",
};

interface Props {
  post: FoodPost;
  showStatus?: boolean;
  actions?: React.ReactNode;
}

export default function FoodCard({ post, showStatus, actions }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {post.image_url ? (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-amber-50 flex items-center justify-center text-5xl">
          🍱
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 leading-tight">{post.title}</h3>
          {showStatus && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${statusColors[post.status]}`}>
              {post.status.replace("_", " ")}
            </span>
          )}
        </div>

        {post.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {post.serves && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              Serves {post.serves}
            </span>
          )}
          {post.is_vegetarian && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Veg</span>
          )}
          {post.is_vegan && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Vegan</span>
          )}
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
            {post.category}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="truncate">{post.address}</span>
        </div>

        {post.donor && (
          <p className="text-xs text-gray-400">by {post.donor.name}</p>
        )}

        <div className="pt-1 flex items-center justify-between">
          <Link
            to={`/food/${post.id}`}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            View details
          </Link>
          {actions}
        </div>
      </div>
    </div>
  );
}
