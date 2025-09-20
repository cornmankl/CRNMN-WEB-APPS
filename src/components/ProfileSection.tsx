interface ProfileSectionProps {
  user: any;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <section className="mb-16" id="profile">
      <h1 className="text-3xl md:text-4xl font-extrabold neon-text mb-8">User Profile</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 card p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-neutral-700 mb-4 flex items-center justify-center text-4xl font-bold">
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.name || 'User'} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <h2 className="text-2xl font-bold">{user?.name || 'THEFMSMKT User'}</h2>
          <p className="text-[var(--neutral-400)]">{user?.email || 'user@thefmsmkt.com'}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-icons text-base neon-text">star</span>
            <span className="font-semibold">{user?.loyaltyPoints || 0} Points</span>
          </div>
          <button className="mt-6 btn-secondary w-full">Edit Profile</button>
        </div>

        <div className="md:col-span-2 card p-6">
          <h3 className="text-xl font-bold mb-4">Welcome to THEFMSMKT</h3>
          <div className="mb-6">
            <p className="text-[var(--neutral-400)] mb-4">
              Terima kasih telah bergabung dengan keluarga besar THEFMSMKT CMNTYPLX! 
              Nikmati pengalaman corn gourmet terbaik Malaysia.
            </p>
          </div>

          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[var(--neutral-800)] rounded-xl">
              <div>
                <p className="font-semibold">CORNMAN Classic Cup</p>
                <p className="text-sm text-[var(--neutral-400)]">Most popular item - RM 7.90</p>
              </div>
              <span className="text-sm neon-text">Add to Cart</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--neutral-800)] rounded-xl">
              <div>
                <p className="font-semibold">Loyalty Program Joined</p>
                <p className="text-sm text-[var(--neutral-400)]">Start earning points now!</p>
              </div>
              <span className="text-sm neon-text">+100 pts</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">Flavor Preferences</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-sm rounded-full bg-opacity-20 neon-bg neon-text">
              🍫 Chocolate
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-opacity-20 neon-bg neon-text">
              🧀 Cheddar Cheese
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-[var(--neutral-700)] text-[var(--neutral-300)]">
              🥛 Susu Pekat
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-[var(--neutral-700)] text-[var(--neutral-300)]">
              🍯 Caramel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
