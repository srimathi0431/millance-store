class AffiliateStatsModel {
  final int totalReferrals;
  final double totalEarnings;
  final String referralLink;
  final String referralCode;
  final List<AffiliateReferralModel> directReferrals;

  AffiliateStatsModel({
    required this.totalReferrals,
    required this.totalEarnings,
    required this.referralLink,
    required this.referralCode,
    required this.directReferrals,
  });

  factory AffiliateStatsModel.fromJson(Map<String, dynamic> json) {
    final dynamic referralsData = json['direct_referrals'] ?? json['referrals'] ?? [];
    final List<dynamic> referralsJson = referralsData is List ? referralsData : [];
    final referrals = referralsJson.map((r) => AffiliateReferralModel.fromJson(r as Map<String, dynamic>)).toList();
    
    return AffiliateStatsModel(
      totalReferrals: json['total_referrals'] ?? json['total'] ?? 0,
      totalEarnings: (json['total_earnings'] ?? json['earnings'] ?? 0).toDouble(),
      referralLink: json['referral_link'] ?? json['link'] ?? '',
      referralCode: json['referral_code'] ?? json['code'] ?? '',
      directReferrals: referrals,
    );
  }
}

class AffiliateReferralModel {
  final int id;
  final String name;
  final String username;
  final DateTime joinedAt;

  AffiliateReferralModel({
    required this.id,
    required this.name,
    required this.username,
    required this.joinedAt,
  });

  factory AffiliateReferralModel.fromJson(Map<String, dynamic> json) {
    return AffiliateReferralModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      username: json['username'] ?? '',
      joinedAt: json['joined_at'] != null
          ? DateTime.parse(json['joined_at'])
          : DateTime.now(),
    );
  }
}

class AffiliateTreeModel {
  final int level;
  final List<AffiliateTreeMemberModel> members;

  AffiliateTreeModel({
    required this.level,
    required this.members,
  });

  factory AffiliateTreeModel.fromJson(Map<String, dynamic> json) {
    final List<dynamic> membersJson = json['members'] ?? [];
    final members = membersJson.map((m) => AffiliateTreeMemberModel.fromJson(m)).toList();
    
    return AffiliateTreeModel(
      level: json['level'] ?? 0,
      members: members,
    );
  }
}

class AffiliateTreeMemberModel {
  final int id;
  final String name;
  final String username;
  final int level;
  final DateTime joinedAt;

  AffiliateTreeMemberModel({
    required this.id,
    required this.name,
    required this.username,
    required this.level,
    required this.joinedAt,
  });

  factory AffiliateTreeMemberModel.fromJson(Map<String, dynamic> json) {
    return AffiliateTreeMemberModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      username: json['username'] ?? '',
      level: json['level'] ?? 0,
      joinedAt: json['joined_at'] != null
          ? DateTime.parse(json['joined_at'])
          : DateTime.now(),
    );
  }
}
